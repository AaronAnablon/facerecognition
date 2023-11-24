export const drawRectAndLabelFace = (fullDesc, faceMatcher, participants, ctx) => {

  // Loop through each desc
  fullDesc &&
    fullDesc.forEach((desc) => {
      // Extract boxes and classes
      const { x, y, width, height } = desc.detection.box;
      const landmarksPoint = desc.landmarks._positions;

      // console.log(landmarksPoint)
      // const text = desc['class'];
      const bestMatch = faceMatcher && faceMatcher.findBestMatch(desc.descriptor);
      // Set styling
      if (bestMatch && bestMatch._label !== "unknown" && bestMatch._label !== null && bestMatch._label !== undefined) {
        let filterParticipants = participants.filter(
          (participant) => participant.id == bestMatch?._label
        );
        // console.log(filterParticipants);
        bestMatch._label = filterParticipants[0].firstName + " " + filterParticipants[0].lastName;
        // bestMatch._label = filterParticipants[0].firstName + " " + filterParticipants[0].lastName + " ";
      }

      ctx.font = "normal 18px Gotham, Helvetica Neue, sans-serif";
      ctx.lineWidth = 2;
      ctx.strokeStyle = bestMatch?._label == "unknown" ? "#E00" : "#0E0";

      // draw 68 points
      // landmarksPoint.map(point => {
      //   ctx.beginPath();
      //   ctx.fillText(bestMatch?._label, x, y + height + 20);
      //   ctx.fillStyle = bestMatch?._label == "unknown" ? "#E00" : "#0E0";
      //   ctx.arc(point._x, point._y, 3, 0, 2 * Math.PI);
      //   ctx.closePath();

      //   ctx.fill();
      // })


      // Draw rectangles and text
      ctx.beginPath();
      ctx.fillStyle = bestMatch?._label == "unknown" ? "#E00" : "#0E0";
      ctx.rect(x * 2, y * 2, width + 50, height + 50);

      ctx.fillText(bestMatch?._label, x * 2, y * 4);
      // ctx.fillText(`L2: ${bestMatch?.distance.toFixed(2)}`, x, y);

      ctx.stroke();
    });
};
