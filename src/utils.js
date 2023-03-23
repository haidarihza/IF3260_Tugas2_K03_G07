function getVectorNormal(vpos) {
	const n = vpos.length;
	var vNormals = [];
	for (let i = 0; i < n; i += 12){
	  const p1 = [vpos[i], vpos[i+1], vpos[i+2]];
	  const p2 = [vpos[i+3], vpos[i+4], vpos[i+5]];
	  const p3 = [vpos[i+6], vpos[i+7], vpos[i+8]];
	  const vec1 = subtractVectors(p2, p1);
	  const vec2 = subtractVectors(p3, p1);
	  const normalDirection = cross(vec1, vec2);
	  const vecNormal  = normalize(normalDirection);
	  for (let j = 0; j < 4; j++){
		vNormals = vNormals.concat(vecNormal);
	  }
	}
	return vNormals;
} 

function subtractVectors(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function normalize(v) {
    var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    // make sure we don't divide by 0.
    if (length > 0.00001) {
      return [v[0] / length, v[1] / length, v[2] / length];
    } else {
      return [0, 0, 0];
    }
  }

function cross(a, b) {
    return [a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]];
}

function convertColors(colors) {
	var colorsArray = [];
	for (let i = 0; i < colors.length; i++){
		colorsArray.push(colors[i]/255);
	}
	return colorsArray;
}