const sleep = (second: number) =>
  new Promise((res) => {
    setTimeout(res, second * 1000);
  });

export default sleep;
