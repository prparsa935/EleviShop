import { 
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender
 
    
    
    } from '@tanstack/react-table';
import data from './test.json'
import Button from '../Button/Button';

const Table=()=>{

 const columns = [
    {
        id: 'select-col',
        header: ({ table }) => (
          <input type='checkbox'
          
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()} //or getToggleAllPageRowsSelectedHandler
          />
        ),
        cell: ({ row }) => (
          <input type='checkbox'
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
    {
      header: 'نام',
      accessorKey: 'firstName',
    },
    {
      header: 'نام خانوادگی ',
      accessorKey: 'lastName',

    },
    {
      header: 'سن',
      accessorKey: 'age', 
    },
    {
        header: 'مشاهده ها',
        accessorKey: 'visits', 
        
      },
      {
        header: 'عملیات',
        accessorKey: 'progress', 
        cell: ({ cell, row }) => {
            return (
                <div className='d-flex'>
                     <Button morCss='mx-2' txtColor='text-bf-sky' bgColor='bg-bf-lighter-sky' size='sm'>مشاهده</Button>
                     <Button txtColor='text-bf-red' bgColor='bg-bf-lighter-red' size='sm'>حذف</Button>
                </div>
            )
          }
      },
      {
        header: 'وضعیت',
        accessorKey: 'status', 
      },

  ]
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    
    rowCount:1,
    initialState: {
        columnOrder: ['select-col'],
        pageIndex: 1, //custom initial page index
        pageSize: 1, //custom default page size
        
      }
     //order doesn't matter anymore!
});
    return(
        <table>
            
            <thead>
                {table.getHeaderGroups().map((headerGroup)=>{
                    return(
                        <tr  className='border' key={headerGroup.id} >
                            {headerGroup.headers.map((header)=>{
                                return(
                                    <th className='sub-txt-color text-sm h6 px-5 py-4  ' key={header.id} colSpan={header.colSpan}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}

                                    </th>
                                )
                            })}
                        </tr>
                    )
                })}
            </thead>
            <tbody >
                {table.getRowModel().rows.map(row => (
                    <tr  className='border  ' key={row.id}>
                        
                        {row.getVisibleCells().map(cell => {
                            return <td  className='px-5 py-4 sub-txt-color' key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        })}
                    {/* ... */}
                    </tr>
                ))}
            </tbody>
            <div className='d-flex'>
                
                <Button
                size='sm'
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
                >
                {'<<'}
                </Button>
                <Button
                size='sm'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                >
                {'<'}
                </Button>
                <Button
                size='sm'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                >
                {'>'}
                </Button>
                <Button
                size='sm'
                onClick={() => table.lastPage()}
                disabled={!table.getCanNextPage()}
                >
                {'>>'}
                </Button>
                
                <select
                className='h-100'
                value={table.getState().pagination.pageSize}
                onChange={e => {
                    table.setPageSize(Number(e.target.value))
                }}
                >
                {[10, 20, 30, 40, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                    {pageSize}
                    </option>
                ))}
                </select>
            </div>

            
        </table>

        

        
    )

}

export default Table