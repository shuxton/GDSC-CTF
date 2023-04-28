const { challenges } = require("../challenges");

const calculatePoints = (answers) => {
  let points = 0;
  let answered = 0;
  answers.forEach((el) => {
    const challenge = challenges.find((a) => a.id == el.id);
    if (challenge?.answer?.toLowerCase().trim() == el.answer?.toLowerCase().trim()) {
      points += challenge.points;
      answered++;
    }
  });

  return {points,answered};
};


module.exports={
    calculatePoints
}