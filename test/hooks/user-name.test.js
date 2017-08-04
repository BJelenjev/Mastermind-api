const { expect } = require('chai');
const userName = require('../../src/hooks/user-name');

describe('\'userName\' hook', () => {
  // A mock hook object
  const mock = {
    data:{
      user:{
        email: 'firstname@domain.com',
      }
    }
  };
  // Initialize our hook with no options
  const hook = userName();

  it('adds the user part of the e-mail as name of the user'), () =>{
    return hook(mock).then(result => {
      expect(result.data.user.email).to.eq('firstname');
    });

  };

});
