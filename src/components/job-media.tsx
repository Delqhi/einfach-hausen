export function JobMedia({src,alt}:{src:string;alt:string}){
  const video=/\.(mp4|webm|mov|m4v)(?:$|\?)/i.test(src);
  return video?<video className="hero-photo" src={src} controls preload="metadata" playsInline aria-label={alt}/>:<img className="hero-photo" src={src} alt={alt}/>;
}
