export const fetchProducts = async(value,setOpen, setLoading, setProducts, fetch)=>{
    try{
        setOpen(true)
        setLoading(true)
        const response = await fetch(`/products?search=${value}`,{
            method:'GET',
        })
        const res = await response.json()
        setProducts(res.body?.data?.products?.nodes)
        setLoading(false)
    }
    catch(err){
        setLoading(false)
        console.log(err)
    }
}
