import Person from './model/Person';
import sum from './mymath';

global.app = function() {
  var simonzg = new Person('Simon', 'Zhang');
  console.log(simonzg.fullName);
  var x = sum(0, 3);
  console.log('hey');
  console.log('what the hack');
};

app();
