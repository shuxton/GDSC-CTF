const { challenges } = require("../challenges");

const calculatePoints = (answers) => {
  let points = 0;
  let answered = 0;
  let answeredArr=[]
  answers.forEach((el) => {
    const challenge = challenges.find((a) => a.id == el.id);
    if (challenge && challenge?.answer?.toLowerCase().trim() == el.answer?.toLowerCase().trim()) {
      points += challenge.points;
      answered++;
      answeredArr.push(el.id)
    }
    else if(challenge && el.id==11 && 'flag: qwerty_rot47_poiuy' == el.answer?.toLowerCase().trim()){
      points += challenge.points;
      answered++;
      answeredArr.push(el.id)
    }
  });

  return {points,answered,answeredArr};
};


module.exports={
    calculatePoints
}