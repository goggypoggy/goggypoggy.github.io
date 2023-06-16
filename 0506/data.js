let 
  shaderProgram,
  Scene = [],
  gl,
  MatrBuf,
  angle = 0,
  matrW = new mat4(),
  matrVP = new mat4(),
  projDist = 1,
  projSize = 1,
  projFarClip = 3000000;