
export default (req, res, next) => {
  const startHrTime = process.hrtime();
  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      const elapsedHrTime = process.hrtime(startHrTime);
      const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
      console.log(`%s ${JSON.stringify(req.body)}: %fms`, req.path, elapsedTimeInMs);
    }
  });
  next();
}