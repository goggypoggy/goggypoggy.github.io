#version 300 es

precision highp float;

uniform float Time;

in vec4 in_pos;

void main( void ) 
{
    gl_Position = in_pos;
}