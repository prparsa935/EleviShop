import { useEffect, useRef, useState } from "react";

const SmartImage = ({
  src,
  alt = "",
  className = "",
  width,
  height,
  sizes,
  srcSet,
  ratio,
  eager = false,
  objectFit,
  style,
  ...rest
}) => {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setErrored(false);
    const el = ref.current;
    if (el) {
      if (eager) {
        el.setAttribute("fetchpriority", "high");
      } else {
        el.setAttribute("fetchpriority", "auto");
      }
      if (el.complete && el.naturalWidth > 0) {
        setLoaded(true);
      }
    }
  }, [src, eager]);

  const resolvedStyle = {
    ...(ratio ? { aspectRatio: ratio } : null),
    ...(objectFit ? { objectFit } : null),
    ...style,
  };

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      srcSet={srcSet}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => setErrored(true)}
      className={[
        "smart-img",
        loaded ? "is-loaded" : "",
        errored ? "is-errored" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={resolvedStyle}
      {...rest}
    />
  );
};

export default SmartImage;
