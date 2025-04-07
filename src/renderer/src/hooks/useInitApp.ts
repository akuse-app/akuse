import { useEffect } from "react"
import { useSetAtom } from "jotai"
import { userListsAtom } from "@/atoms"

// load media lists
export function useInitApp() {
  const setLibrary = useSetAtom(userListsAtom)

  useEffect(() => {
    async function load() {
      try {
        const data = []
        setLibrary(undefined)
      } catch (err) {
        console.error("Errore durante il fetch iniziale", err)
      }
    }

    load()
  }, [])
}
