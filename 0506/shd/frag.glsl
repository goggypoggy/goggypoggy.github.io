#version 300 es

in highp vec4 fr_color;
out highp vec4 outColor;

void main( void )
{
    outColor = fr_color;
}