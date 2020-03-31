function Map(props) {
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  // NOTE: as its for showcase we only suport likes
  // const [isLike, setIsLike] = useState(true);

  function specifyCriterion() {
    // mapbox.setPaintProperty('boundry', 'fill-color', [
    //   'interpolate',
    //   ['exponential', 0.5],
    //   ['zoom'],
    //   15,
    //   '#e2714b',
    //   22,
    //   '#eee695'
    //   ]);

    const zoom = map.getZoom();
    (function loop() {
      if (_totalLikes) {
        console.log('runnnnnnning lllllllooooooooop');
        if (zoom < 4) {
          map.setPaintProperty('boundry', 'fill-color', [
            'case',
            ['!=', ['feature-state', 'fans'], null],
            [
              'interpolate',
              ['linear'],
              ['feature-state', 'fans'],
              0,
              'rgba(236, 225, 203,0.0)',
              1,
              'rgba(211,47,47,1.0)',
            ],
            'rgba(255,255,255,0.0)',
          ]);
          return true;
        }
        if (zoom < 7) {
          map.setPaintProperty('boundry', 'fill-color', [
            'case',
            ['!=', ['feature-state', 'fans'], null],
            [
              'interpolate',
              ['linear'],
              ['feature-state', 'fans'],
              0,
              'rgba(236, 225, 203,0.0)',
              1,
              'rgba(211,47,47,1.0)',
            ],
            'rgba(255,255,255,0.0)',
          ]);

          return true;
        }
        map.setPaintProperty('boundry', 'fill-color', [
          'case',
          ['!=', ['feature-state', 'fans'], null],
          [
            'interpolate',
            ['linear'],
            ['feature-state', 'fans'],
            0,
            'rgba(236, 225, 203,0.0)',
            1,
            'rgba(211,47,47,1.0)',
          ],
          'rgba(255,255,255,0.0)',
        ]);
      } else {
        setTimeout(() => {
          loop();
        }, 50);
      }
    })();
  }

  if (mapReducer.flyTo.state === true) {
    console.log('flyyyyyyyyyyyyyyyyyyyyyyyy');
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
      // map.fitBounds([
      //   [32.958984, -5.353521],
      //   [43.50585, 5.615985],
      // ]);
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

    if (clubReducer.cityCoords) {
      map.flyTo({
        center: clubReducer.cityCoords,
        zoom: 5,
        essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      });
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

  function getAddress(coords) {
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
  }

  function addUserLocationMarker(e) {
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
  }

  function addToSourceOnMove() {
    if (map.getSource('boundary-source')) {
      const pathnameSplit = pathname.split('/');
      const id = pathnameSplit[pathnameSplit.length - 1];

      const splitHref = window.location.href.split('/');
      const val = splitHref[splitHref.length - 1];

      console.log('-----------------', val);

      // TODO: store val and if it chenged clear the previous ones;
      // TODO: set different colors for likes and dislikes
      // TODO: change dots to pins

      // log('bbox is ', bbox);

      const fs = map.queryRenderedFeatures({ layers: ['boundry'] });
      const { length } = fs;
      if (fsLength !== length) {
        fsLength = length;
        const array = fs.map(f => f.id);
        const uniqueArray = [...new Set(array)];
        const reducedDuplicates = [];

        uniqueArray.forEach((u, i) => {
          if (!localDataRef[u]) {
            localDataRef[u] = 1;
            reducedDuplicates.push(u);
          }

          if (uniqueArray.length - 1 === i && reducedDuplicates.length) {
            axios
              .post('https://www.fansclub.app/api/v1/POST/getLikesForPolys', {
                teamId: state.teamId,
                reducedDuplicates,
              })
              .then(response => {
                const { likes } = response.data;
                Object.keys(likes).forEach(key => {
                  map.setFeatureState(
                    {
                      source: 'boundary-source',
                      sourceLayer: 'boundry',
                      id: String(key) /* dataValues['USA1' + row.STATE_ID].id_int */,
                    },
                    { fans: likes[key] * 3000 }
                  );
                });
              })
              .catch(error => {
                // TODO: check this out
              });
          }
        });
      }
    }

    return null;
  }

  function addOnData() {
    addToSourceOnData();
    specifyCriterion();
  }

  function addOnMove(m) {
    // const pathnameSplit = pathname.split('/');
    // const id = pathnameSplit[pathnameSplit.length - 1];
    // const val = isLike === true ? 'like' : 'dislike';
    // const bbox = map.getBounds();
    // callApi(bbox, val, id);

    addToSourceOnMove();
    specifyCriterion();

    map.off('data', addOnData);
  }

  function onClick(e) {
    getAddress(e.lngLat.wrap(), (err, address) => {
      if (address) {
        dispatch(signupActions.updateLocation(e.lngLat.wrap()));
        dispatch(signupActions.updateAddress(address.data.features[0].place_name));
      }
    });

    if (userLocationMarker !== null) {
      userLocationMarker.remove();
    }
    userLocationMarker = new mapboxgl.Marker({
      draggable: false,
    });
    userLocationMarker.setLngLat(e.lngLat.wrap());
    userLocationMarker.addTo(map);
  }

  if (state.mode === 0) {
    map.off('click', addUserLocationMarker);
    if (userLocationMarker !== null) {
      userLocationMarker.remove();
    }
  }
  if (state.mode === 1) {
    map.on('click', addUserLocationMarker);
  }

  if (state.mode !== 'wait' && state.mode !== 2) {
    map.off('moveend', clearFansLocation);
  }
  if (state.mode === 2) {
    map.on('moveend', clearFansLocation);

    const pathnameSplit = pathname.split('/');
    // log('-------------------------------', <i className="fas fa-helicopter    " />);
    console.log(pathname.split('/'));
    if (
      (pathnameSplit[pathnameSplit.length - 1] &&
        state.teamId !== pathnameSplit[pathnameSplit.length - 1]) ||
      searchModeReducer !== searchMode
    ) {
      setSearchMode(searchModeReducer);
      console.log('get cluuuuuuuuuuuuuub');
      // alert(pathnameSplit[pathnameSplit.length - 1]);
      console.log(
        '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<',
        state.teamId,
        pathnameSplit[pathnameSplit.length - 1],
        pathnameSplit[pathnameSplit.length - 1] &&
          state.teamId !== pathnameSplit[pathnameSplit.length - 1]
      );

      setState({ ...state, teamId: pathnameSplit[pathnameSplit.length - 1] });
    }

    (function loop() {
      if (map && map.isStyleLoaded()) {
        if (!map.getSource('boundary-source')) {
          // (async () => {

          map.off('click', onClick);
          // })();
        }
      }
    })();
  }
}
