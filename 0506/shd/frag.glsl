#version 300 es

precision highp float;

uniform UBuf
{
    mat4 MatrWVP;
    mat4 MatrW;
    vec4 CamPos;
};

in vec3 vs_Pos;
in vec3 vs_Norm;
in vec4 vs_Color;

out vec4 outColor;

void main( void )
{
    
    vec3 L = normalize(vec3(0.0, 1.0, 0.5));
    vec3 LC = vec3(1.0, 1.0, 1.0);
    vec3 Ka = vec3(0.1);
    vec3 Kd = vs_Color.xyz;
    vec3 Ks = vec3(1.0);
    float Ph = 1.0;
  
    vec3 V = normalize(vs_Pos - CamPos.xyz);

    // Ambient
    vec3 color = min(vec3(0.1), Ka);

    vec3 N = faceforward(vs_Norm, V, vs_Norm);
    
    // Diffuse
    color += max(0.0, dot(N, L)) * Kd * LC;

    // Specular
    vec3 R = reflect(V, N);
    color += pow(max(0.0, dot(R, L)), Ph) * Ks * LC;
    
    color.x = pow(color.x, 1.0 / 2.2);
    color.y = pow(color.y, 1.0 / 2.2);
    color.z = pow(color.z, 1.0 / 2.2);

    outColor = vec4(color, 1.0);
}