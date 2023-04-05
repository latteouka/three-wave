attribute float a_random;
attribute float a_number;
uniform float u_time;

varying vec3 v_pos;
varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_viewPosition;
varying vec3 v_worldPosition;

void main(){
  v_pos = position;
  v_uv = uv;
  // v_normal = normalize(normalMatrix * normal);
  v_normal = normalMatrix * mat3(instanceMatrix) * normal;

  vec4 mPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);
  float yOffset = a_random * 0.005 + sin(u_time + 10.0 * a_random) * 0.1;
  mPosition.y += yOffset;

  vec4 mvPosition = viewMatrix * mPosition;
  v_viewPosition = -mvPosition.xyz;
  v_worldPosition = mPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;
}
