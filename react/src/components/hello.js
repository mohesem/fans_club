import hello from 'hellojs';

hello.init(
  {
    facebook: '726965834493962',
    google: '951334179095-359plh303nv4b6oi184594gi11jmpvfk.apps.googleusercontent.com',
  },

  { redirect_uri: 'https://www.fansclub.app/auth/callback' }
);

window.hello = hello;

export default hello;
