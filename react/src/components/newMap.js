function Map(props) {



  /* -------------------------------------------------------------------------- */
  /*                                  reducers                                  */
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /*                                  functions                                 */
  /* -------------------------------------------------------------------------- */

  const getAddress = useCallback(
    coords => {
      return new Promise((resolve, reject) => {
        /* TODO: use getLocation bar as a sub component and pass submit on hold to that */
        setState({ ...state, submitLocationOnHold: true });
        coordsArray.push(coords);

        getAddressFromMapboxApi(coords)
          .then(res => {
            log('mapbox res', res);
            resolve(res);
            setState({ ...state, submitLocationOnHold: false });
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    [state]
  );

  const addUserLocationMarker = useCallback(
    e => {
      if (map.getLayer('likes')) {
        map.removeLayer('likes');
        map.removeSource('likes');
      }
      if (map.getLayer('dislikes')) {
        map.removeLayer('dislikes');
        map.removeSource('dislikes');
      }

      if (map.getLayer('boundryLine')) map.removeLayer('boundryLine');
      if (map.getLayer('boundry')) map.removeLayer('boundry');
      if (map.getSource('boundary-source')) map.removeSource('boundary-source');
      dispatch(signupActions({ submitButtonState: false }));
      getAddress(e.lngLat.wrap())
        .then(address => {
          if (address) {
            log('final result is ==> ', {
              location: e.lngLat.wrap(),
              address: address.data.features[0].place_name,
            });
            dispatch(
              signupActions({
                location: e.lngLat.wrap(),
                address: address.data.features[0].place_name,
                submitButtonState: true,
              })
            );
          }
        })
        .catch(() => {
          log('some error came from mapbox');
        });

      if (userLocationMarker !== null) {
        userLocationMarker.remove();
      }
      userLocationMarker = new mapboxgl.Marker({
        draggable: false,
      });
      userLocationMarker.setLngLat(e.lngLat.wrap());
      userLocationMarker.addTo(map);
    },
    [dispatch, getAddress]
  );






  const addFollowersPins = useCallback(() => {
    if (map.getZoom() > 8) {
      const bbox = map.getBounds();
      getMembersFromPoly(bbox, likeOrDislike, teamId)
        .then(res => {
          geojson.features = [];
          res.data.likes.forEach(like => {
            if (Number(like.fid) < 500) {
              const newLike = {
                type: 'Feature',
                geometry: like.geo,
                // properties: { icon-image: 'love' },
              };
              geojson.features.push(newLike);
            }
          });

          if (likeOrDislike === 'like') {
            map.getSource('likes').setData(geojson);
          } else {
            map.getSource('dislikes').setData(geojson);
          }
        })
        .catch(err => {
          log(err);
        });
    } else if (map.getSource('likes') || map.getSource('dislikes')) {
      map.getSource('likes').setData({
        type: 'FeatureCollection',
        features: [],
      });
      map.getSource('dislikes').setData({
        type: 'FeatureCollection',
        features: [],
      });
    }
  }, [likeOrDislike, teamId]);

  function specifyCriterion() {
    (function loop() {
      if (_totalLikes && map && map.isStyleLoaded()) {
        // const zoom = map.getZoom();
        map.setPaintProperty('boundry', 'fill-color', [
          'case',
          ['!=', ['feature-state', 'fans'], null],
          [
            'interpolate',
            ['linear'],
            ['feature-state', 'fans'],
            0,
            'rgba(236, 225, 203, 1)',
            1,
            mainColor,
          ],
          'rgba(236, 225, 203, 1)',
        ]);
        return true;
      }
      return setTimeout(() => {
        loop();
      }, 50);
    })();
  }



  if (mapReducer.flyTo.state === true) {
    if (mapReducer.flyTo.coord.length === 2) {
      if (searchMarker !== null) {
        searchMarker.remove();
      }

      map.flyTo({
        center: mapReducer.flyTo.coord,
        zoom: 5,
        essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      });
      searchMarker = new mapboxgl.Marker({
        draggable: false,
      });
      searchMarker.setLngLat(mapReducer.flyTo.coord);
      searchMarker.addTo(map);
      dispatch(mapActions.updateFlyTo({ state: false, coord: [] }));
    } else {
      if (searchMarker !== null) {
        searchMarker.remove();
      }
      const c = mapReducer.flyTo.coord;
      map.fitBounds([
        [c[0], c[1]],
        [c[2], c[3]],
      ]);

      const poly = turf.bboxPolygon(c);
      const centerOfPoly = turf.centroid(poly);
      log('----------------------------------', centerOfPoly);
      searchMarker = new mapboxgl.Marker({
        draggable: false,
      });

      searchMarker.setLngLat(centerOfPoly.geometry.coordinates);
      searchMarker.addTo(map);
      dispatch(mapActions.updateFlyTo({ state: false, coord: [] }));
    }
  }

  if (mapReducer.flyToClub.state === true) {
    // log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%', clubMarker !== null, clubMarker);
    if (clubMarker !== null) {
      log('remove the fucking marker pleeeeeeeeeeeeeeeeeeeeeeeeease');
      clubMarker.remove();
    }

    if (clubReducer.logoBase64) {
      const el = document.createElement('div');
      el.style.background = `url(data:image/png;base64,${clubReducer.logoBase64})`;
      el.style['background-position'] = 'center';
      el.style['background-size'] = 'contain';
      el.style.height = `60px`;
      el.style.width = `60px`;
      el.style['background-repeat'] = 'no-repeat';
      clubMarker = new mapboxgl.Marker(el);
      clubMarker.setLngLat(clubReducer.cityCoords);
      clubMarker.addTo(map);
    }

    setTimeout(() => {
      dispatch(mapActions.updateFlyToClub({ state: false, coord: [] }));
    }, 10);
  }
  /* -------------------------------------------------------------------------- */
  /*                                  effects                                */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const deleteLayers = () => {
      if (map.getLayer('likes')) {
        map.removeLayer('likes');
        map.removeSource('likes');
      }
      if (map.getLayer('dislikes')) {
        map.removeLayer('dislikes');
        map.removeSource('dislikes');
      }
      if (map.getLayer('boundryLine')) map.removeLayer('boundryLine');
      if (map.getLayer('boundry')) map.removeLayer('boundry');
      if (map.getSource('boundary-source')) map.removeSource('boundary-source');
    };

    if (mode === 0) {
      deleteLayers();
      if (userLocationMarker) userLocationMarker.remove();
    }

    if (mode === 1) {
      deleteLayers();
    }
  }, [
    mode,
    chartWidth,
    likeOrDislike,
    teamId,
    pathname,
    setChartWidthFunc,
    getClub,
    getClubTotalLikes,
    clubReducer.cityCoords,
  ]);

  console.log('....................................');




