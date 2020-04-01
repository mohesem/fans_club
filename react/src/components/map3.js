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
