export const CALM_KEY = "lh-calm";

/**
 * Runs in <head> before first paint so calm mode never flashes the loud version.
 * Order of precedence: ?calm=1|0 in the URL → the choice saved this session → prefers-contrast: more.
 */
export const calmBootScript = `(function(){try{var d=document.documentElement,k='${CALM_KEY}',s=null;try{s=sessionStorage.getItem(k)}catch(e){}var q=new URLSearchParams(location.search).get('calm');if(q==='1'||q==='0'){s=q;try{sessionStorage.setItem(k,q)}catch(e){}}var c=s===null?matchMedia('(prefers-contrast: more)').matches:s==='1';if(c)d.setAttribute('data-calm','');if(c||matchMedia('(prefers-reduced-motion: reduce)').matches)d.setAttribute('data-motion','off')}catch(e){}})();`;
