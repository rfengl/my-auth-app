export default function startValidation(val: any, setVal: (v: any) => void) {
    if (!val) {
        const ori = val
        setVal(' ')
        setTimeout(() => {
            setVal(ori)
        }, 1)
    }
} 