export function JobMedia({src,alt,kind='image'}:{src:string;alt:string;kind?:'image'|'video'|'audio'}){
  if(kind==='audio')return <audio className="job-audio" src={src} controls preload="metadata" aria-label={alt}/>;
  return kind==='video'?<video className="hero-photo" src={src} controls preload="metadata" playsInline aria-label={alt}/>:<img className="hero-photo" src={src} alt={alt}/>;
}
