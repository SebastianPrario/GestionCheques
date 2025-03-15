import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getCheckApi, OrderBy } from '../services/apiService'
import { Check } from '../contexts/CheckContext'

const useGetAllChecks = () => {
    const [checkList, setCheckList] = useState<Check[] | null | undefined>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const token = useAuth().user?.token
    const header = { authorization: `Bearer ${token}` }
    const [orderBy, setOrderBy] = useState<{
        order: OrderBy
        asc: 'ASC' | 'DES'
    } | null>({ order: 'fechaEmision', asc: 'ASC' })

    useEffect(() => {
        const fetchChecks = async () => {
            try {
                const response = await getCheckApi(
                    header,
                    orderBy?.order,
                    orderBy?.asc
                )
                if (response === 'token invalido') {
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
