import React from "react"

export function ChartArea({ puntos }: { puntos: number[] }) {
	const data = puntos
	const puntosWithValue = puntos?.filter(punto => punto > 0)
	if (!puntosWithValue || puntosWithValue.length === 0) {
		return <span>No hay datos</span>
	}
	const uniformidad = Math.ceil(
		puntosWithValue?.reduce((acc, valor) => acc + valor, 0) /
			puntosWithValue?.length /
			2
	)

	const maxY = Math.max(...data) // 400 in the example
	const maxX = data.length - 1 // last index (8)

	// Normalization factors (0‑100 range for both axes) with padding for labels
	const paddingX = 8 // space on left for Y‑axis values
	const paddingY = 8 // space at bottom for X‑axis labels
	const chartWidth = 95 - paddingX
	const chartHeight = 95 - paddingY
	const xFactor = maxX === 0 ? 0 : chartWidth / maxX
	const yFactor = maxY === 0 ? 0 : chartHeight / maxY
	// Determine step size (50 or 100) based on the maximum Y value
	const step = maxY <= 200 ? 50 : 100
	const maxTick = Math.ceil(maxY / step) * step
	const yTicks: number[] = []
	for (let v = 0; v <= maxTick; v += step) {
		yTicks.push(v)
	}

	// Build SVG path points – X and Y are scaled to chart area with padding
	const points = data
		.map(
			(value, i) =>
				`${i * xFactor + paddingX},${paddingY + chartHeight - value * yFactor}`
		)
		.join(" L")

	// Path that draws the area (baseline at the bottom = y = 100)
	const pathData = `M${paddingX},${paddingY + chartHeight} L${points} L${paddingX + chartWidth},${paddingY + chartHeight} Z`

	return (
		<div
			style={{
				flex: 1,
				width: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: 0,
			}}
		>
			{/* viewBox is a square 0‑100 × 0‑100. Width/height are set by the parent container */}
			<svg viewBox="0 0 100 100" width="400" height="600">
				<title>Curva de niveles</title>
				<defs>
					<linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#00f" stopOpacity="0.6" />
						<stop offset="1" stopColor="#00f" stopOpacity="0" />
					</linearGradient>
				</defs>
				{/* Background */}
				<rect x="0" y="0" width={100} height={100} fill="#fff" />
				{/* Area (filled only) */}
				<path d={pathData} fill="#b7b7ff" stroke="none" />
				{/* Axes */}
				<path
					d={`M${paddingX},${paddingY + chartHeight} L${paddingX},${paddingY - 10}`}
					stroke="#444"
					strokeWidth="0.25"
				/>
				<path
					d={`M${paddingX},${paddingY + chartHeight} L${paddingX + chartWidth},${paddingY + chartHeight}`}
					stroke="#444"
					strokeWidth="0.25"
				/>
				{/* Horizontal index labels */}
				{data.map((_, idx) => (
					<text
						key={idx}
						x={paddingX + idx * xFactor}
						y={paddingY + chartHeight + 4}
						style={{ fontSize: 1.5 }}
						fill="#444"
						textAnchor="middle"
					>
						{idx + 1}
					</text>
				))}
				{/* Point value labels */}
				{data.map((val, idx) => (
					<React.Fragment key={idx}>
						{/* Value label */}
						<text
							key={`val-${idx}`}
							x={paddingX + idx * xFactor}
							y={paddingY + chartHeight - val * yFactor - 2}
							style={{ fontSize: 2, fill: "#000" }}
							fill="#000"
							textAnchor="middle"
						>
							{val}
						</text>
						{/* Small blue circle at the point */}
						<circle
							cx={paddingX + idx * xFactor}
							cy={paddingY + chartHeight - val * yFactor}
							r={0.4}
							fill="#00f"
							stroke="none"
						/>
					</React.Fragment>
				))}
				{/* Vertical value labels (ticks) */}
				{yTicks.map((val, idx) => (
					<text
						key={idx}
						x={paddingX - 2}
						y={paddingY + chartHeight - val * yFactor}
						style={{ fontSize: 1.5 }}
						fill="#444"
						textAnchor="end"
					>
						{val}
					</text>
				))}
				{/* Uniformidad line */}
				<path
					d={`M${paddingX},${paddingY + chartHeight - uniformidad * yFactor} L${paddingX + chartWidth},${paddingY + chartHeight - uniformidad * yFactor}`}
					stroke="#7629db"
					strokeWidth="0.25"
				/>
			</svg>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					width: "100%",
					justifyContent: "center",
					alignItems: "center",
					gap: 8,
				}}
			>
				<div style={{ fontSize: 7 }}>Eje vertical: mediciones (lx)</div>
				<div style={{ fontSize: 7 }}>Eje horizontal: cantidad de puntos</div>
				<div style={{ display: "flex", flexDirection: "row", gap: 2 }}>
					<div
						style={{
							backgroundColor: "#7629db",
							width: 10,
							height: 10,
							borderRadius: "50%",
						}}
					/>
					<div style={{ fontSize: 7 }}>Uniformidad: {uniformidad}</div>
				</div>
			</div>
		</div>
	)
}
