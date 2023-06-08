#version 300 es

uniform highp float Time, MouseX, MouseY, MouseWheel, Width, Height;

out highp vec4 o_color;

void main( void ) 
{
    highp float i;
    highp vec2 Z, Z1, Z0;
    highp float sx, sy;
    sx = gl_FragCoord.x;
    sy = Height - gl_FragCoord.y;
    if (sx < (MouseX - Width / 8.0 - Width / 64.0) || sx > (MouseX + Width / 8.0 + Width / 64.0) || sy < (MouseY - Height / 8.0 - Height / 64.0) || sy > (MouseY + Height / 8.0 + Height / 64.0))
    {
        Z.x = Z1.x = Z0.x = sx * (4.0) / Width - 2.0;
        Z.y = Z1.y = Z0.y = sy * (4.0) / Height - 2.0;      
    }
    else if (sx < (MouseX - Width / 8.0) || sx > (MouseX + Width / 8.0) || sy < (MouseY - Height / 8.0) || sy > (MouseY + Height / 8.0))
    {
        o_color = vec4(1.0, 0.0, 0.0, 1.0);
        return;
    }
    else
    {
        highp float X0, X1, Y0, Y1;
        X0 = ((MouseX - Width / 8.0 / MouseWheel) * (4.0) / Width - 2.0);
        X1 = ((MouseX + Width / 8.0 / MouseWheel) * (4.0) / Width - 2.0); 
        Y0 = ((MouseY - Height / 8.0 / MouseWheel) * (4.0) / Height - 2.0);
        Y1 = ((MouseY + Height / 8.0 / MouseWheel) * (4.0) / Height - 2.0);
        Z.x = Z1.x = Z0.x = (sx - MouseX + Width / 8.0) * (X1 - X0) / (Width / 4.0) + X0;
        Z.y = Z1.y = Z0.y = (sy - MouseY + Height / 8.0) * (Y1 - Y0) / (Height / 4.0) + Y0;
    }
    
    // Z0.x = 0.6 * sin(Time) + 0.3 * cos(Time);
    // Z0.y = 0.5 * cos(Time) * sin(Time);

    for (i = 0.0; i < 1.0 && Z1.x * Z1.x + Z1.y * Z1.y < 4.0; i += 1.0 / 255.0)
    {
        Z1.x = Z.x * Z.x - Z.y * Z.y + Z0.x;
        Z1.y = Z.y * Z.x + Z.x * Z.y + Z0.y;
        Z = Z1;    
    }
    o_color = vec4(i, i, i, 1.0);
}