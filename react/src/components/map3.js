function Map(props) {
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  // NOTE: as its for showcase we only suport likes
  // const [isLike, setIsLike] = useState(true);

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
