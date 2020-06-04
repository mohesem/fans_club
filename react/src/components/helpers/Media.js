import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Platform} from 'react-native';

// actions
import {mediaAction} from '../../redux/actions';

export default () => {
  const dispatch = useDispatch();
  const mediaReucer = useSelector(state => state.media);

  if (Platform.OS === 'web') {
    useEffect(() => {
      function handleSize() {
        const width = window.innerWidth;
        if (width <= 576 && mediaReucer !== 'sm') {
          dispatch(mediaAction('sm'));
        } else if (width >= 768 && width < 992 && mediaReucer !== 'md') {
          dispatch(mediaAction('md'));
        } else if (width >= 992 && mediaReucer !== 'lg') {
          dispatch(mediaAction('lg'));
        } else {
          return null;
        }
      }

      if (!mediaReucer) {
        handleSize();
      }

      window.addEventListener('resize', handleSize);

      return () => window.removeEventListener('resize', handleSize);
    }, [dispatch, mediaReucer]);
  } else {
    dispatch(mediaAction('sm'));
  }

  return null;
};
