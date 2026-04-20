import { useState, useEffect, useRef, useCallback } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet"
import L from "leaflet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Loader2 } from "lucide-react"

// Fix leaflet default marker icons in Vite/webpack
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

export interface LocationResult {
    lugarNombre: string
    direccion: string
    ciudad: string
    codigoPostal: string
    pais: string
    lat: number
    lon: number
}

interface LocationPickerProps {
    onSelect: (result: LocationResult) => void
    initialLat?: number
    initialLon?: number
}

// Subcomponent: fixes size on mount and moves view when coords change
function MapController({ lat, lon }: { lat: number; lon: number }) {
    const map = useMap()
    useEffect(() => {
        setTimeout(() => map.invalidateSize(), 0)
    }, [map])
    useEffect(() => {
        map.setView([lat, lon], 16)
    }, [lat, lon, map])
    return null
}

// Subcomponent: invalidates map size on first render (fixes partial tile loading)
function MapInvalidator() {
    const map = useMap()
    useEffect(() => {
        setTimeout(() => map.invalidateSize(), 100)
    }, [map])
    return null
}

// Subcomponent: handles click events on the map
function ClickHandler({ onMapClick }: { onMapClick: (lat: number, lon: number) => void }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng)
        },
    })
    return null
}

async function reverseGeocode(lat: number, lon: number): Promise<LocationResult | null> {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
            { headers: { "Accept-Language": "es" } }
        )
        const data = await res.json()
        if (!data || data.error) return null
        const addr = data.address || {}
        const road = addr.road || addr.pedestrian || addr.footway || ""
        const houseNumber = addr.house_number ? ` ${addr.house_number}` : ""
        return {
            lugarNombre: data.name || data.display_name?.split(",")[0] || "",
            direccion: road ? `${road}${houseNumber}` : data.display_name?.split(",").slice(0, 2).join(", ") || "",
            ciudad: addr.city || addr.town || addr.village || addr.municipality || "",
            codigoPostal: addr.postcode || "",
            pais: addr.country || "",
            lat,
            lon,
        }
    } catch {
        return null
    }
}

async function forwardGeocode(query: string): Promise<{ lat: number; lon: number; display: string } | null> {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=1`,
            { headers: { "Accept-Language": "es" } }
        )
        const data = await res.json()
        if (!data?.length) return null
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), display: data[0].display_name }
    } catch {
        return null
    }
}

export function LocationPicker({ onSelect, initialLat = 40.4168, initialLon = -3.7038 }: LocationPickerProps) {
    const [markerPos, setMarkerPos] = useState<[number, number] | null>(null)
    const [mapCenter, setMapCenter] = useState<[number, number]>([initialLat, initialLon])
    const [searchQuery, setSearchQuery] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [isReversing, setIsReversing] = useState(false)
    const [searchResults, setSearchResults] = useState<any[]>([])
    const searchRef = useRef<HTMLDivElement>(null)
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Live search suggestions
    useEffect(() => {
        if (searchQuery.length < 3) { setSearchResults([]); return }
        if (searchTimeout.current) clearTimeout(searchTimeout.current)
        searchTimeout.current = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&addressdetails=1&limit=5`,
                    { headers: { "Accept-Language": "es" } }
                )
                const data = await res.json()
                setSearchResults(data || [])
            } catch { setSearchResults([]) }
        }, 400)
        return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current) }
    }, [searchQuery])

    const handleMapClick = useCallback(async (lat: number, lon: number) => {
        setMarkerPos([lat, lon])
        setIsReversing(true)
        const result = await reverseGeocode(lat, lon)
        setIsReversing(false)
        if (result) {
            onSelect(result)
            setSearchQuery(result.lugarNombre || result.direccion)
        }
    }, [onSelect])

    const handleSelectSuggestion = async (item: any) => {
        const lat = parseFloat(item.lat)
        const lon = parseFloat(item.lon)
        setMarkerPos([lat, lon])
        setMapCenter([lat, lon])
        setSearchResults([])
        setSearchQuery(item.display_name.split(",")[0])
        setIsReversing(true)
        const result = await reverseGeocode(lat, lon)
        setIsReversing(false)
        if (result) onSelect(result)
    }

    const handleSearch = async () => {
        if (!searchQuery.trim()) return
        setIsSearching(true)
        setSearchResults([])
        const found = await forwardGeocode(searchQuery)
        setIsSearching(false)
        if (found) {
            setMarkerPos([found.lat, found.lon])
            setMapCenter([found.lat, found.lon])
            const result = await reverseGeocode(found.lat, found.lon)
            if (result) onSelect(result)
        } else {
            alert("No se encontró la ubicación. Intenta con otro término.")
        }
    }

    return (
        <div className="space-y-3">
            {/* Search bar */}
            <div className="relative" ref={searchRef}>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar lugar o dirección..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSearch() } }}
                        />
                    </div>
                    <Button type="button" variant="secondary" onClick={handleSearch} disabled={isSearching} className="shrink-0">
                        {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                </div>

                {/* Suggestions dropdown */}
                {searchResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {searchResults.map((item, i) => (
                            <button
                                key={i}
                                type="button"
                                className="w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors border-b border-border last:border-0 flex items-start gap-2"
                                onClick={() => handleSelectSuggestion(item)}
                            >
                                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                                <span className="truncate">{item.display_name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Loading indicator */}
            {isReversing && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" /> Obteniendo dirección...
                </p>
            )}

            {/* Map */}
            <div className="rounded-lg overflow-hidden border border-border" style={{ height: 320 }}>
                <MapContainer
                    center={mapCenter}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                    className="z-0"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapInvalidator />
                    <ClickHandler onMapClick={handleMapClick} />
                    {markerPos && <MapController lat={markerPos[0]} lon={markerPos[1]} />}
                    {markerPos && <Marker position={markerPos} />}
                </MapContainer>
            </div>

            <p className="text-xs text-muted-foreground">
                Haz clic en el mapa o busca un lugar para autocompletar la dirección
            </p>
        </div>
    )
}
