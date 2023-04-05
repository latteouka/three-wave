uniform float u_time;
uniform sampler2D u_matcap;
uniform sampler2D u_scan;

varying vec3 v_pos;
varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_viewPosition;
varying vec3 v_worldPosition;

void main(void) {
  float time = u_time * 0.0001;

  vec3 normal = normalize(v_normal);
  // matcap
  vec3 viewDir = normalize( v_viewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;

  vec4 matcapColor = texture2D(u_matcap, uv);

  // scan animation
  vec2 scanUv = fract(v_worldPosition.xz); 
  // not facing up
  if(v_normal.y < 0.0) {
    scanUv = fract(v_uv * 14.0);
  }
  vec4 scanMask = texture2D(u_scan, scanUv);

  // wave
  vec3 origin = vec3(0.0);
  float dist = distance(v_worldPosition, origin);
  float radialMove = fract(dist - u_time / 2.0);

  radialMove *= 1.0 - smoothstep(0.0, 10.0, dist);
  // radialMove *= 1.0 - step(u_time, dist);

  float scanMix = smoothstep(0.3, 0.0, 1.0 - radialMove);
  scanMix *= 1.0 + scanMask.r;

  vec4 pink = vec4(vec3(0.973, 0.812, 0.812), 1.0);

  vec4 final = mix(matcapColor, pink, scanMix);

  gl_FragColor = final;
  // gl_FragColor = vec4(vec3(scanMix), 1.0);
}
