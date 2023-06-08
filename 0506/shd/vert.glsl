#version 300 es

uniform highp mat4 MatrWVP;

in highp vec4 in_pos;
out highp vec4 fr_color;

void main( void )
{
    gl_Position = in_pos * MatrWVP;
    fr_color = vec4(in_pos.xyz, 1);
}