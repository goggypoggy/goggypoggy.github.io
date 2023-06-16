#version 300 es

precision highp float;

uniform UBuf
{
    mat4 MatrWVP;
    mat4 MatrW;
};

in vec3 in_pos;
in vec3 in_norm;

out vec3 vs_Pos;
out vec3 vs_Norm;
out vec4 vs_Color;

void main( void )
{
    gl_Position = MatrWVP * vec4(in_pos, 1.0); 
    vs_Pos = (MatrW * vec4(in_pos, 1.0)).xyz;
    vs_Norm = mat3(MatrW) * in_norm;
    vs_Color = vec4(0.3, 0.2, 0.4, 1.0);
}