/**
 * Logo officiel BARB'OR GUYANE
 * Place le fichier logo dans web/public/logo.png
 * Le composant adapte les couleurs selon le fond (dark = version inversée)
 */
export const Logo = ({ size = 80, variant = 'gold', className = '' }) => {
  // variant "gold" = logo sur fond sombre (anneau doré)
  // variant "dark" = logo original fond blanc
  return (
    <div
      className={`relative flex items-center justify-center rounded-full overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      {variant === 'gold' ? (
        /* Version fond sombre : logo avec filtre doré */
        <img
          src="/logo.png"
          alt="BARB'OR GUYANE"
          width={size}
          height={size}
          style={{
            width: size,
            height: size,
            objectFit: 'contain',
            filter: 'invert(1) sepia(1) saturate(3) hue-rotate(5deg) brightness(0.95)',
          }}
          draggable={false}
        />
      ) : (
        /* Version originale (fond clair) */
        <img
          src="/logo.png"
          alt="BARB'OR GUYANE"
          width={size}
          height={size}
          style={{ width: size, height: size, objectFit: 'contain' }}
          draggable={false}
        />
      )}
    </div>
  )
}
