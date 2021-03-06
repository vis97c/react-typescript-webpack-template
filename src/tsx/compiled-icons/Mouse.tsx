import * as React from 'react';

const SvgMouse = (props: React.SVGProps<SVGSVGElement>) => <svg width={35} height={55} {...props}><path fill="#FFF" d="M17.5 22a1.5 1.5 0 01-1.5-1.5v-7a1.5 1.5 0 013 0v7a1.5 1.5 0 01-1.5 1.5z" /><path fill="#FFF" d="M17.5 55C7.851 55 0 47.149 0 37.5v-20C0 7.851 7.851 0 17.5 0S35 7.851 35 17.5v20C35 47.149 27.149 55 17.5 55zm0-53C8.953 2 2 8.953 2 17.5v20C2 46.047 8.953 53 17.5 53S33 46.047 33 37.5v-20C33 8.953 26.047 2 17.5 2z" /></svg>;

export default SvgMouse;