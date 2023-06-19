#version 300 es

precision highp float;

uniform float Time, X0, X1, Y0, Y1, Width, Height;

out vec4 o_color;

void main( void ) 
{
    float i;
    vec2 Z, Z1, Z0;
    float sx, sy;
    sx = gl_FragCoord.x;
    sy = Height - gl_FragCoord.y;

    Z.x = Z1.x = Z0.x = sx * (X1 - X0) / Width + X0;
    Z.y = Z1.y = Z0.y = sy * (Y1 - Y0) / Height + Y0;

    // Z0.x = 0.6 * sin(Time) + 0.3 * cos(Time);
    // Z0.y = 0.5 * cos(Time) * sin(Time);

    for (i = 0.0; i < 1.0 && Z1.x * Z1.x + Z1.y * Z1.y < 4.0; i += 1.0 / 255.0)
    {
        Z1.x = Z.x * Z.x - Z.y * Z.y + Z0.x;
        Z1.y = Z.y * Z.x + Z.x * Z.y + Z0.y;
        Z = Z1;    
    }
    o_color = vec4(mix(0.0, 100.0 / 255.0, i), mix(0.0, 149.0 / 255.0, i), mix(0.0, 237.0 / 255.0, i), 1.0);
}