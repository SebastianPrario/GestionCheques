import { useEffect, useState } from 'react'
import { fetchApi, OrderBy } from '../services/apiService'
import { Check } from '../contexts/CheckContext'

const useGetAllChecks = () => {
    const [checkList, setCheckList] = useState<Check[] | null | undefined>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [orderBy, setOrderBy] = useState<{
        order: OrderBy
        asc: 'ASC' | 'DES'
    } | null>({ order: 'fechaEmision', asc: 'ASC' })

    useEffect(() => {
        const fetchChecks = async () => {
            try {
                const response = await fetchApi('/cheques', 'GET', undefined, {
                    orderBy: `${orderBy?.order}${orderBy?.asc}`,
                })
                if (!response) {
                    setError('Invalid token')
                } else {
                    const data = response ? response.data : []
                    setCheckList(data)
                }
            } catch (error) {
                setError('Error fetching checks')
            } finally {
                setLoading(false)
            }
        }

        fetchChecks()
    }, [orderBy])

    return { checkList, setCheckList, loading, error, setOrderBy, orderBy }
}
export default useGetAllChecks
