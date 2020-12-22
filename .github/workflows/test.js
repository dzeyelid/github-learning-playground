module.exports = ({github, context}) => {
  console.log('in test.js');
  return context.payload;
}