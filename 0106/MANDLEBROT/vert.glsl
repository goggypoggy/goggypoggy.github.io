#version 300 es

uniform highp float Time;

in highp vec4 in_pos;

void main( void ) 
{
    gl_Position = in_pos;
}