function Map(props) {
  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleShreButtons() {
    if (openShareButtons) return setOpenShareButtons(false);
    return setOpenShareButtons(true);
  }

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

  function setChartWidthFunc() {
    if (window.innerWidth >= 360 && state.chartWidth < 300) {
      setState({ ...state, chartWidth: 300 });
    }
    if (window.innerWidth < 360) {
      setState({ ...state, chartWidth: window.innerWidth - 60 });
    }
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

  function handleLegendsVisibility() {
    if (state.legends === 0) return setState({ ...state, legends: 1 });
    return setState({ ...state, legends: 0 });
  }

  function addToSourceOnMove() {
    if (map.getSource('boundary-source')) {
      const pathnameSplit = pathname.split('/');
      const id = pathnameSplit[pathnameSplit.length - 1];
      const bbox = map.getBounds();

      const splitHref = window.location.href.split('/');
      const val = splitHref[splitHref.length - 1];

      console.log('-----------------', val);

      // TODO: store val and if it chenged clear the previous ones;
      // TODO: set different colors for likes and dislikes
      // TODO: change dots to pins

      // log('bbox is ', bbox);
      if (map.getZoom() > 8) {
        getMembersFromPoly(bbox, val, id)
          .then(res => {
            geojson.features = [];

            console.log('&&&&&&&&&&&&&&&&&&', res);
            res.data.likes.forEach(like => {
              if (Number(like.fid) < 500) {
                const newLike = {
                  type: 'Feature',
                  geometry: like.geo,
                };
                geojson.features.push(newLike);
              }
            });

            map.getSource('custom').setData(geojson);
          })
          .catch(err => {
            log(err);
          });
      }
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

  function addToSourceOnData() {
    if (map.getSource('boundary-source')) {
      const bbox = map.getBounds();

      const fs = map.queryRenderedFeatures({ layers: ['boundry'] });
      const { length } = fs;
      if (fsLength !== length) {
        // log('bbox is addToSourceOnData', bbox);
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
                      id: key /* dataValues['USA1' + row.STATE_ID].id_int */,
                    },
                    { fans: likes[key] / 3 }
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

  function clearFansLocation() {
    if (
      map.getZoom() < 8 &&
      map.getSource('custom') &&
      map.getSource('custom')._data.features.length
    ) {
      map.getSource('custom').setData({
        type: 'FeatureCollection',
        features: [],
      });
    }
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
    setChartWidthFunc();

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
          map.addSource('boundary-source', {
            type: 'vector',
            tiles: ['https://www.fansclub.app/api/v1/GET/tiles/{z}/{x}/{y}'],
            minzoom: 0,
            maxzoom: 18,
          });

          const boundry = {
            id: 'boundry',
            type: 'fill',
            source: 'boundary-source',
            'source-layer': 'boundry',
            paint: [
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
              'rgba(255,255,255,1)',
            ],
          };

          const boundry2 = {
            id: 'boundryLine',
            type: 'line',
            source: 'boundary-source',
            'source-layer': 'boundry',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#424242',
              'line-width': 2,
            },
          };

          map.addSource('custom', {
            type: 'geojson',
            data: geojson,
          });

          const likesLayer = {
            id: 'likes',
            type: 'circle',
            source: 'custom',
            paint: {
              'circle-radius': 6,
              'circle-color': '#B42222',
            },
          };

          // (async () => {
          map.addLayer(boundry, 'waterway-label');
          map.addLayer(boundry2, 'waterway-label');
          map.addLayer(likesLayer, 'waterway-label');
          map.on('data', addOnData);
          map.on('moveend', addOnMove);
          map.off('click', onClick);
          // })();
        }
      } else {
        setTimeout(() => {
          loop();
        }, 50);
      }
    })();
  }

  const ShareButtons = () => {
    if (openShareButtons) {
      return (
        <div className="Demo__container">
          <div className="Demo__some-network">
            <FacebookShareButton
              url={shareUrl}
              quote={title}
              className="Demo__some-network__share-button"
            >
              <FacebookIcon size={32} round />
            </FacebookShareButton>

            {/* <div>
              <FacebookShareCount url={shareUrl} className="Demo__some-network__share-count">
                {count => count}
              </FacebookShareCount>
            </div> */}
          </div>

          <div className="Demo__some-network">
            <FacebookMessengerShareButton
              url={shareUrl}
              appId="521270401588372"
              className="Demo__some-network__share-button"
            >
              <FacebookMessengerIcon size={32} round />
            </FacebookMessengerShareButton>
          </div>

          <div className="Demo__some-network">
            <TwitterShareButton
              url={shareUrl}
              title={title}
              className="Demo__some-network__share-button"
            >
              <TwitterIcon size={32} round />
            </TwitterShareButton>

            {/* <div className="Demo__some-network__share-count">&nbsp;</div> */}
          </div>

          <div className="Demo__some-network">
            <TelegramShareButton
              url={shareUrl}
              title={title}
              className="Demo__some-network__share-button"
            >
              <TelegramIcon size={32} round />
            </TelegramShareButton>

            {/* <div className="Demo__some-network__share-count">&nbsp;</div> */}
          </div>

          <div className="Demo__some-network">
            <WhatsappShareButton
              url={shareUrl}
              title={title}
              separator=":: "
              className="Demo__some-network__share-button"
            >
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>

            {/* <div className="Demo__some-network__share-count">&nbsp;</div> */}
          </div>

          <div className="Demo__some-network">
            <LinkedinShareButton url={shareUrl} className="Demo__some-network__share-button">
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
          </div>

          <div className="Demo__some-network">
            <PinterestShareButton
              url={String(window.location)}
              media={`${String(window.location)}`}
              className="Demo__some-network__share-button"
            >
              <PinterestIcon size={32} round />
            </PinterestShareButton>

            {/* <div>
              <PinterestShareCount url={shareUrl} className="Demo__some-network__share-count" />
            </div> */}
          </div>

          <div className="Demo__some-network">
            <VKShareButton
              url={shareUrl}
              image={`${String(window.location)}`}
              className="Demo__some-network__share-button"
            >
              <VKIcon size={32} round />
            </VKShareButton>
            {/*
            <div>
              <VKShareCount url={shareUrl} className="Demo__some-network__share-count" />
            </div> */}
          </div>

          <div className="Demo__some-network">
            <OKShareButton
              url={shareUrl}
              image={`${String(window.location)}`}
              className="Demo__some-network__share-button"
            >
              <OKIcon size={32} round />
            </OKShareButton>

            {/* <div>
              <OKShareCount url={shareUrl} className="Demo__some-network__share-count" />
            </div> */}
          </div>

          <div className="Demo__some-network">
            <RedditShareButton
              url={shareUrl}
              title={title}
              windowWidth={660}
              windowHeight={460}
              className="Demo__some-network__share-button"
            >
              <RedditIcon size={32} round />
            </RedditShareButton>

            {/* <div>
              <RedditShareCount url={shareUrl} className="Demo__some-network__share-count" />
            </div> */}
          </div>

          <div className="Demo__some-network">
            <TumblrShareButton
              url={shareUrl}
              title={title}
              className="Demo__some-network__share-button"
            >
              <TumblrIcon size={32} round />
            </TumblrShareButton>

            {/* <div>
              <TumblrShareCount url={shareUrl} className="Demo__some-network__share-count" />
            </div> */}
          </div>

          <div className="Demo__some-network">
            <LivejournalShareButton
              url={shareUrl}
              title={title}
              description={shareUrl}
              className="Demo__some-network__share-button"
            >
              <LivejournalIcon size={32} round />
            </LivejournalShareButton>
          </div>

          <div className="Demo__some-network">
            <MailruShareButton
              url={shareUrl}
              title={title}
              className="Demo__some-network__share-button"
            >
              <MailruIcon size={32} round />
            </MailruShareButton>
          </div>

          <div className="Demo__some-network">
            <EmailShareButton
              url={shareUrl}
              subject={title}
              body="body"
              className="Demo__some-network__share-button"
            >
              <EmailIcon size={32} round />
            </EmailShareButton>
          </div>
          <div className="Demo__some-network">
            <ViberShareButton
              url={shareUrl}
              title={title}
              className="Demo__some-network__share-button"
            >
              <ViberIcon size={32} round />
            </ViberShareButton>
          </div>

          <div className="Demo__some-network">
            <WorkplaceShareButton
              url={shareUrl}
              quote={title}
              className="Demo__some-network__share-button"
            >
              <WorkplaceIcon size={32} round />
            </WorkplaceShareButton>
          </div>

          <div className="Demo__some-network">
            <LineShareButton
              url={shareUrl}
              title={title}
              className="Demo__some-network__share-button"
            >
              <LineIcon size={32} round />
            </LineShareButton>
          </div>

          <div className="Demo__some-network">
            <WeiboShareButton
              url={shareUrl}
              title={title}
              image={`${String(window.location)}`}
              className="Demo__some-network__share-button"
            >
              <WeiboIcon size={32} round />
            </WeiboShareButton>
          </div>

          <div className="Demo__some-network">
            <PocketShareButton
              url={shareUrl}
              title={title}
              className="Demo__some-network__share-button"
            >
              <PocketIcon size={32} round />
            </PocketShareButton>
          </div>

          <div className="Demo__some-network">
            <InstapaperShareButton
              url={shareUrl}
              title={title}
              className="Demo__some-network__share-button"
            >
              <InstapaperIcon size={32} round />
            </InstapaperShareButton>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* {state.mode === 1 ? <GetUserlocationNav /> : null} */}
      {state.mode === 2 ? (
        <>
          <div id="state-legend" className="legend" hidden={state.legends === 0}>
            <h4>Population</h4>
            <div>
              <span style={{ backgroundColor: helper.c0 }} />
              {helper.step0}
            </div>
            <div>
              <span style={{ backgroundColor: helper.c1 }} />
              {helper.step1}
            </div>
            <div>
              <span style={{ backgroundColor: helper.c2 }} />
              {helper.step2}
            </div>
            <div>
              <span style={{ backgroundColor: helper.c3 }} />0
            </div>
          </div>
          <div
            id="state-legend"
            className="legend legend-chart"
            style={{ width: state.chartWidth }}
            hidden={state.legends === 1}
          >
            <h4>Population</h4>
            <div>
              <Line
                options={{
                  tooltips: {
                    displayColors: false,
                    // backgroundColor: 'black',
                    enabled: true,
                    mode: 'multiple',
                    bodyFontSize: 15,
                    bodyFontFamily: 'Gamja Flower',
                    bodyFontColor: 'white',
                    yPadding: 5,
                    xPadding: 5,
                    cornerRadius: 4,
                    bodyFontStyle: 'bold',
                  },
                  legend: {
                    display: true,
                  },
                  layout: {
                    padding: {
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                    },
                  },
                  scales: {
                    yAxes: [
                      {
                        ticks: {},
                      },
                    ],
                    xAxes: [
                      {
                        ticks: {},
                      },
                    ],
                  },
                  maintainAspectRatio: true,
                  animation: true,
                }}
                data={{
                  labels: ['0', '1', '2', '3', '4', '5', '6'],

                  datasets: [
                    {
                      label: 'total',
                      fill: false,
                      lineTension: 0.1,
                      backgroundColor: 'rgba(75,192,192,0.4)',
                      borderColor: '#2196f3',
                      borderCapStyle: 'butt',
                      borderDash: [],
                      borderDashOffset: 0.0,
                      borderJoinStyle: 'miter',
                      pointBorderColor: 'rgba(75,192,192,1)',
                      pointBackgroundColor: '#fff',
                      pointBorderWidth: 1,
                      pointHoverRadius: 5,
                      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                      pointHoverBorderColor: 'rgba(220,220,220,1)',
                      pointHoverBorderWidth: 2,
                      pointRadius: 3,
                      pointHitRadius: 10,
                      data: helper.chartTotal,
                    },
                    {
                      label: 'male',
                      fill: false,
                      lineTension: 0.1,
                      backgroundColor: 'rgba(75,192,192,0.4)',
                      borderColor: '#fb8c00',
                      borderCapStyle: 'butt',
                      borderDash: [],
                      borderDashOffset: 0.0,
                      borderJoinStyle: 'miter',
                      pointBorderColor: 'rgba(75,192,192,1)',
                      pointBackgroundColor: '#fff',
                      pointBorderWidth: 1,
                      pointHoverRadius: 5,
                      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                      pointHoverBorderColor: 'rgba(220,220,220,1)',
                      pointHoverBorderWidth: 2,
                      pointRadius: 3,
                      pointHitRadius: 10,
                      data: helper.chartMales,
                    },
                    {
                      label: 'female',
                      fill: false,
                      lineTension: 0.1,
                      backgroundColor: 'rgba(75,192,192,0.4)',
                      borderColor: '#673ab7',
                      borderCapStyle: 'butt',
                      borderDash: [],
                      borderDashOffset: 0.0,
                      borderJoinStyle: 'miter',
                      pointBorderColor: 'rgba(75,192,192,1)',
                      pointBackgroundColor: '#fff',
                      pointBorderWidth: 1,
                      pointHoverRadius: 5,
                      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                      pointHoverBorderColor: 'rgba(220,220,220,1)',
                      pointHoverBorderWidth: 2,
                      pointRadius: 3,
                      pointHitRadius: 10,
                      data: helper.chartFemales,
                    },
                  ],
                }}
              />
            </div>
          </div>
          <div id="stop-virtualization" className="legend-stop-virtualization">
            <IconButton style={{ padding: 3, color: '#dd2c01' }}>
              <Link
                variant="body2"
                component={RedirectTo}
                to="/"
                style={{ height: '24px', width: '24px' }}
              >
                <CloseRoundedIcon />
              </Link>
            </IconButton>
          </div>

          <div id="show-chart" className="legend-show-chart">
            <IconButton style={{ padding: 3, color: '#263238' }}>
              <Link
                variant="body2"
                onClick={handleLegendsVisibility}
                style={{ height: '24px', width: '24px' }}
              >
                {state.legends === 0 ? (
                  <FormatListBulletedRoundedIcon />
                ) : (
                  <TrendingUpRoundedIcon />
                )}
              </Link>
            </IconButton>
          </div>

          <div id="link-legend" className="legend-Link">
            <IconButton style={{ padding: 3, color: '#263238' }} onClick={handleShreButtons}>
              <LinkRoundedIcon />
            </IconButton>
          </div>
          <ShareButtons />
        </>
      ) : null}
    </>
  );
}
