export default function GlobalBackground() {
    return (
        <div className="global-bg" aria-hidden="true">
            {/* Mesh gradient base */}
            <div className="global-bg-mesh" />
            {/* Animated orbs */}
            <div className="global-orb global-orb-1" />
            <div className="global-orb global-orb-2" />
            <div className="global-orb global-orb-3" />
            <div className="global-orb global-orb-4" />
            {/* Subtle grid overlay */}
            <div className="global-bg-grid" />
        </div>
    );
}
