var randomStringGenerator = (length) => {
  var alphanumeric =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  var str = "";
  for (var i = 0; i < length; i++) {
    var index = math.floor(math.random() * alphanumeric.length);
    str += alphanumeric[index];
  }
  return str;
};

var passGenerator = (length) => {
  var choices =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+|}{:?></.,';][=-`";
  var upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var lowerCase = "abcedefghijklmnopqrstuvwxyz";
  var numbers = "123456789";
  var symbol = "~!@#$%^&*()_+|}{:?></.,';][=-`";

  //generate random indexes for each group
  var str = "";
  var indexUpper = Math.floor(Math.random() * upperCase.length);
  var indexLower = Math.floor(Math.random() * lowerCase.length);
  var indexNumbers = Math.floor(Math.random() * numbers.length);
  var indexSymbol = Math.floor(Math.random() * symbol.length);

  //generate string concatinating each char

  str =
    upperCase[indexUpper] +
    lowerCase[indexLower] +
    numbers[indexNumbers] +
    symbols[indexSymbol];

    //remaining string generated randomly

    for(var i = 4; i<length; i++){
        str += choices[Math.floor(Math.random()*choices.length)]
    }
    return str 
};

export {randomStringGenerator, passGenerator}