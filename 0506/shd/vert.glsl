#version 300 es

uniform UBuf
{
    highp mat4 MatrWVP;
};

in highp vec3 in_pos;
out highp vec4 fr_color;

void main( void )
{
    gl_Position = vec4(in_pos, 1.0) * MatrWVP; 
    fr_color = vec4(in_pos.xyz, 1.0);
}