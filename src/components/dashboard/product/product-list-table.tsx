import { ChangeEvent, Fragment, MouseEvent, useEffect, useState } from 'react';
// import useState from 'react-usestateref'
import type { FC } from 'react';
import { addMonths, format } from 'date-fns';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import WarningIcon from '@mui/icons-material/WarningOutlined';
import { alpha } from '@mui/material/styles';
import {
  Avatar,
  Box, Button, Card, CardContent, CardMedia,Checkbox, Chip, Container, Divider, FormControl, Grid, IconButton, InputLabel, Link, ListItemText, MenuItem, Modal, OutlinedInput, Paper, Select,
  SelectChangeEvent, Switch, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField, Typography
} from '@mui/material';
import { ChevronDown as ChevronDownIcon } from '../../../icons/chevron-down';
import { ChevronRight as ChevronRightIcon } from '../../../icons/chevron-right';
import type { Item } from '../../../types/product';
import { Scrollbar } from '../../scrollbar';
import { SeverityPill } from '../../severity-pill';
import { productApi, ProductStatus } from 'src/__fake-api__/product-api';
import { Category } from 'src/types/APIcategory';
import { SubCategory } from 'src/types/APISubCategory';
import { PropertyListItem } from 'src/components/property-list-item';
import { BuyerType } from 'src/types/buyerTypes';
import { useAuth } from 'src/hooks/use-auth';
import { useRouter } from 'next/router'
import { Po } from 'src/types/pos';
import { ItemsDiscount } from 'src/types/IitemDiscounts';
import { TiposRegistro } from 'src/types/APITiposRegistro';
import { FileDropzone } from '../../file-dropzone';
import { fileToBase64 } from '../../../utils/file-to-base64';
import { styled } from '@mui/material/styles';
import { ConstructionOutlined, DoDisturb } from '@mui/icons-material';
import { DatePicker, DateTimePicker } from '@mui/lab';

import ExcelIcon from '@mui/icons-material/ArrowDownwardSharp';

import { APIUser } from 'src/types/APIUser';
import { authApi } from 'src/__fake-api__/auth-api';
import { User } from 'src/icons/user';

//import { exportToExcel  } from 'react'

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { WidgetPreviewer } from '../../widget-previewer';
import { Modal8 } from '../../widgets/modals/modal-8';



interface ProductListTableProps {
  onPageChange: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  products: Item[];
  categories: Category[];
  pos: Po[];
  tiposregistro : TiposRegistro[];
  productsCount: number;
  rowsPerPage: number;
  cambioPrecios: boolean;
  
}

export const ProductListTable: FC<ProductListTableProps> = (props) => {
  const {
    onPageChange,
    onRowsPerPageChange,
    page,
    products,
    pos,
    tiposregistro,
    productsCount,
    rowsPerPage,
    categories,
    cambioPrecios,
    
    ...other
  } = props;
  const [openProduct, setOpenProduct] = useState<string | null>(null);
  const [checked, setChecked] = useState<boolean>(false);

  const [checkedSKU, setCheckedSKU] = useState<boolean>(false);

  const [aceptaDevolucion, setAceptaDevolucion] = useState<boolean>(false);
  const { user } = useAuth();
  const router = useRouter();
  const [confidencial, setConfidencial] = useState<string>('0');
  const [amountCosto, setAmountCosto] = useState<string>('0');
  const [introduccion, setIntroduccion] = useState<string>('0');
  const [fijo, setFijo] = useState<string>('0');
  const [promocional, setPromocional] = useState<string>('0');
  const [ddc,setDDC] = useState<string>('0');
  const [tax,setTAX] = useState<string>('0');

  const [dfisdate,setDfisdate] =  useState<Date | null>()
  const [dfiedate,setDfiedate] =  useState<Date | null>()
  const [dcsdate,setDcsdate] =  useState<Date | null>()
  const [dcedate,setDcedate] =  useState<Date | null>()
  const [ddcsdate,setDdcsdate] =  useState<Date | null>()
  const [ddcedate,setDdcedate] =  useState<Date | null>()
  const [deisdate,setDeisdate] =  useState<Date | null>()
  const [deiedate,setDeiedate] =  useState<Date | null>()
  const [dndsdate,setDndsdate] =  useState<Date | null>()
  const [dndedate,setDndedate] =  useState<Date | null>()
  const [paesdate,setPaesdate] =  useState<Date | null>()
  const [paeedate,setPaeedate] =  useState<Date | null>()
  const [taesdate,setTaesdate] =  useState<Date | null>()
  const [taeedate,setTaeedate] =  useState<Date | null>()
  const [taxsdate,setTaxsdate] =  useState<Date | null>()
  const [taxedate,setTaxedate] =  useState<Date | null>()

 

  const [usuarioload, setUsuarioload] = useState<APIUser | null>(null);
  
  const [superviquezUtility, setSuperviquezUtility] = useState<number>(0);

  const [nodevolucion,setNoDevolucion] = useState<string>('0');
  const [comercialLongDescription, setComercialLongDescription] = useState<string>('');
  const [comercialShortDescription, setComercialShortDescription] = useState<string>('');
  const [comercialPubliDescription, setComercialPubliDescription] = useState<string>('');

  const [comercialFonetDescription, setComercialFonetDescription] = useState<string>('');
  const [comercialHablaDescription, setComercialHablaDescription] = useState<string>('');

  const [grossCostAmount, setGrossCostAmount] = useState<number>(0);
  const [periPrice, setPeriPrice] = useState<number>(0);
  const [superPrice, setSuperPrice] = useState<number>(0);
  const [sarettoPrice, setSarettoPrice] = useState<number>(0);
  const [superviquezPrice, setSuperviquezPrice] = useState<number>(0);

  const [superviquezCostUtility, setSuperviquezCostUtility] = useState<number>(0);
  const [subCategories, setSubCategories] = useState<SubCategory[]>();
  const [posID, setPosID] = useState<number | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [itemFileCod, setItemFileCod] = useState<string>();
  const [sarettoCostSale, setSarettoCostSale] = useState<number>(0);
  const [sarettoCostUtility, setSarettoCostUtility] = useState<number>(0);
  const [periCostSale, setPeriCostSale] = useState<number>(0);
  const [superviquezCostSale, setSuperviquezCostSale] = useState<number>(0);
  const [periCostUtility, setPeriCostUtility] = useState<number>(0);
  const [supercomproCostSale, setSupercomproCostSale] = useState<number>(0);
  const [supercomproCostUtility, setSupercomproCostUtility] = useState<number>(0);
  const [categoryIdSelected, setCategoryIdSelected] = useState<number | null>(null);
  const [subCategoryIdSelected, setSubCategoryIdSelected] = useState<number | null>(null);
  const [tipoRegistroIdSelected, setTipoRegistroIdSelected] = useState<number | null>(null);
  const [buyerTypeSelected, setBuyerTypeSelected] = useState<number | null>(null);
  const [itmDiscounts, setItmDiscounts] = useState<ItemsDiscount[]>();
  const [buyerTypes, setBuyerTypes] = useState<BuyerType[]>();
  const [descuentoFijo, setdescuentoFijo] = useState(0)

  const [SkuSustituciones, setskySustituciones] = useState<Item[]>();



  const [IdSegmentacionSelected, setIdSegmentacionSelected] = useState<number | null>(null);

  const [IdAreaManejoSelected, setIdAreaManejoSelected] = useState<number | null>(null);

  const [ProyMenVtasCol, setProyMenVtasCol] = useState(0);
  const [ProyMenVtasUni, setProyMenVtasUni] = useState(0);
  
  const [skuSustitucionSelected, setSkuSustitucionSelected] = useState('');
 
  const [modalRetorno, setmodalRetorno] = useState(true);


  const [UbicacionCedi, setUbicacionCedi] = useState<string>('');

  const [foto1,setfoto1] = useState('/static/mock-images/covers/caja.png')
  const [foto2,setfoto2] = useState('/static/mock-images/covers/caja.png')
  const [foto3,setfoto3] = useState('/static/mock-images/covers/caja.png')
  const [foto4,setfoto4] = useState('/static/mock-images/covers/caja.png')
  const [foto5,setfoto5] = useState('/static/mock-images/covers/caja.png')

  const ASegmentacionArticulo = [
    {
      "idSegmentacion": 1,
      "dsSegmentacion": "Marca Privada",
     
    },
     {
      "idSegmentacion": 2,
      "dsSegmentacion": "Suministros",
     
    },
     {
      "idSegmentacion": 3,
      "dsSegmentacion": "PYME",
     
    },
     {
      "idSegmentacion": 4,
      "dsSegmentacion": "Regular",
     
    },
   
  ]


  const AareaManejo = [
    {
      "idAreaManejo": 1,
      "dsAreaManejo": "PLANTA",
     
    },
    {
      "idAreaManejo": 2,
      "dsAreaManejo": "CROSS DOCKING",
     
    },
    {
      "idAreaManejo": 3,
      "dsAreaManejo": "MENUDEO",
     
    },
    
   
  ]

  const [motivosRetorno, setmotivosRetorno] = useState<string>('');

  const MotivosRetornoItem = [
    {
      "idRetorno": 1,
      "dsRetorno": "Revisar Costos",
     
    },
    {
      "idRetorno": 2,
      "dsRetorno": "Revisar Descripciones",
     
    },
    {
      "idRetorno": 3,
      "dsRetorno": "Ajustar Descuentos",
     
    },
    
   
  ]

  const [devolverA, setdevolverA] = useState<string>('');

  const DevolverA = [
    {
      "idDevolverA": 1,
      "dsDevolverA": "ADC",
     
    },
    {
      "idDevolverA": 2,
      "dsDevolverA": "Asistente",
     
    },
    {
      "idDevolverA": 3,
      "dsDevolverA": "Proveedor",
     
    },
    
   
  ]
  


  const posts = [
    
    {
      id: '24b76cac9a128cd949747080',
     
      category: 'F',
      cover: foto1,
      title: 'FOTO UNO'
    },
    {
      
      id: 'a9c19d0caf2ca91020aacd1f',
   
      category: 'L',
      cover: foto2,
     title: 'FOTO DOS'
    },
    {
      id: '44df90cbf89963b8aa6258c7d',
    
      category: 'A',
      cover: foto3,
      title: 'FOTO TRES'
    },
    {
      id: 'a9c19d0caf2ca91020aacd1f2',
   
      category: 'G',
      cover: foto4,
     title: 'FOTO CUATRO'
    },
    {
      id: '44df90cbf89963b8aa625c7d2',
    
      category: 'K',
      cover: foto5,
      title: 'FOTO CINCO'
    }
  ];

  const handleDropCover1 = async ([file]: File[]) => {
    const data = await fileToBase64(file) as string;
    {setfoto1(data);} 
  };

  const handleDropCover2 = async ([file]: File[]) => {
   const data = await fileToBase64(file) as string;
   {setfoto2(data);} 
  };

  const handleDropCover3 = async ([file]: File[]) => {
   const data = await fileToBase64(file) as string;
   {setfoto3(data);} 
  };

  const handleDropCover4 = async ([file]: File[]) => {
    const data = await fileToBase64(file) as string;
    {setfoto4(data);} 
   };

   const handleDropCover5 = async ([file]: File[]) => {
    const data = await fileToBase64(file) as string;
    {setfoto5(data);} 
   };

  const handleRemove1 = (): void => {
    setfoto1('/static/mock-images/covers/caja.png');
  };
  const handleRemove2 = (): void => {
    setfoto2('/static/mock-images/covers/caja.png');
  };
  const handleRemove3 = (): void => {
    setfoto3('/static/mock-images/covers/caja.png');
  };

  const [openMod, setOpenMod] = useState(false);
  const handleOpen = () => setOpenMod(true);
  const handleClose = () => setOpenMod(false);

  //user.formActive = true ;

  useEffect(() => {
    const loadDFijo = async () => {

      if(user.UserType == '3' && categoryIdSelected)
      {
      console.log('DESC FIJO',user.gln,categoryIdSelected)
      const descFijos = await productApi.getDescFijo(user.gln,categoryIdSelected!?? 0)
      console.log('datillos',descFijos)
      if(descFijos[0])
      {setdescuentoFijo(descFijos[0].descfijo) 
       //alert('Descuento fijo:' + descuentoFijo.toString())  
      }
      else 
      {setdescuentoFijo(0) 
        //alert('Descuento fijo:' + descuentoFijo.toString())  
       }
      

      }
      

    }
    loadDFijo();
  }, [categoryIdSelected])   


  
//console.log('descuentos:',products)
  useEffect(() => {
    const loadInfo = async () => {

      //alert('Me invocaron')
      //const dataUser = await authApi.GetUser(Number(user.id)); 
      
     
     
      const data = await productApi.getBuyerTypes();
      const discounts = await productApi.getItemDicounts(openProduct ?? "");
      setItmDiscounts(discounts);
      //console.log('Descuentos:' , discounts)
      setBuyerTypes(data);
      const productSelected = products.find(q => q.gtin == openProduct );
      
      console.log('PRODUCTO CARGADOS------------------------------>',productSelected)

      const dataSkuSust = await productApi.getProductsCambPrecio(user.gln);
      setskySustituciones(dataSkuSust)
     

      console.log('TIPO REGISTRO',productSelected)

      //setCategoryIdSelected(Number(productSelected?.CategoryId)) 

      if(user.UserType != "3")
      {
      setCategoryIdSelected(Number(productSelected?.CategoryId))  
      setSubCategoryIdSelected(Number(productSelected?.SubCategoryId)) 
       }
     
      setTipoRegistroIdSelected(Number(productSelected?.TipoRegistro_ID))
      setBuyerTypeSelected(Number(productSelected?.TipoCompraId));
      setIdSegmentacionSelected(Number(productSelected?.SegmentacionArticulo));
      setIdAreaManejoSelected(Number(productSelected?.AreaManejo))
      //setSubCategoryIdSelected(Number(productSelected?.SubCategoryId)) **
   
      
      console.log('CARGA DE LA CATEGORIA',categoryIdSelected)

      if(productSelected?.CompraEnUnidad) {
                   setChecked(true)} 
                   else 
                   {setChecked(false)}
      
      console.log('LA CATEGORIA',categoryIdSelected)



     //  const gross = redondeo(Number(grossCost(productSelected, discounts).toFixed(2)));



 // -----------------------------------------------------------------------------------------
     // LLAMADO A CALCULOS DEL COSTO NETO
     const gross = Number(grossCost(productSelected, discounts).toFixed(2));
    //  alert(gross)
 // -----------------------------------------------------------------------------------------

  //      alert(gross)

      //setGrossCostAmount(redondeo(gross));
      setGrossCostAmount(gross);
   

      setDfisdate(new Date(itmDiscounts?.find(q => q.ruleCode == 'FIJO')?.startDate ?? new Date()))
      setDfiedate(new Date(itmDiscounts?.find(q => q.ruleCode == 'FIJO')?.endDate ?? new Date()))

      setDdcsdate(new Date(itmDiscounts?.find(q => q.ruleCode == 'DDC')?.startDate ?? new Date()))
      setDdcedate(new Date(itmDiscounts?.find(q => q.ruleCode == 'DDC')?.endDate ?? new Date()))

      if (user.UserType!="3")
      {

       setDeisdate(new Date(itmDiscounts?.find(q => q.ruleCode == 'INTRODUCCION')?.startDate ?? new Date()))
       setDeiedate(new Date(itmDiscounts?.find(q => q.ruleCode == 'INTRODUCCION')?.endDate ?? new Date()))

      } 

      setDcsdate(new Date(itmDiscounts?.find(q => q.ruleCode == 'CONFIDENCIAL')?.startDate ?? new Date()))
      setDcedate(new Date(itmDiscounts?.find(q => q.ruleCode == 'CONFIDENCIAL')?.endDate ?? new Date()))

      setDndsdate(new Date(itmDiscounts?.find(q => q.ruleCode == 'NO DEVOLUCION')?.startDate ?? new Date()))
      setDndedate(new Date(itmDiscounts?.find(q => q.ruleCode == 'NO DEVOLUCION')?.endDate ?? new Date()))

      setPaesdate(new Date(itmDiscounts?.find(q => q.ruleCode == 'PROMOCIONAL')?.startDate ?? new Date()))
      setPaeedate(new Date(itmDiscounts?.find(q => q.ruleCode == 'PROMOCIONAL')?.endDate ?? new Date()))

      setTaesdate(new Date(itmDiscounts?.find(q => q.ruleCode == 'CENTRO DE DISTRIBUCION')?.startDate ?? new Date()))
      setTaeedate(new Date(itmDiscounts?.find(q => q.ruleCode == 'CENTRO DE DISTRIBUCION')?.endDate ?? new Date()))

      setTaxsdate(new Date(itmDiscounts?.find(q => q.ruleCode == 'IMPUESTO')?.startDate ?? new Date()))
      setTaxedate(new Date(itmDiscounts?.find(q => q.ruleCode == 'IMPUESTO')?.endDate ?? new Date()))




//alert('enreros')

    console.log('CARGA DE LA FECHA',dfisdate)



    

      
      //alert('Paso 2')
    console.log('valor antes:',periConIVA)
    
    

    if(periPrice==0)
      { 

      if (productSelected?.PeriConIVA ) {setPeriConIVA(((((gross) * (periCostSale + 100)) / 100) * (((100 + (Number(itmDiscounts?.find(q => q.gtin == productSelected?.gtin && q.ruleType == 'TAX')?.value ?? 0))) / 100))).toFixed(2)); }
      else {setPeriConIVA(((((gross) * (periCostSale + 100)) / 100) * (((100 + (Number(itmDiscounts?.find(q => q.gtin == productSelected?.gtin && q.ruleType == 'TAX')?.value ?? 0))) / 100))).toFixed(2));}

      if (productSelected?.PeriSinIVA ) { setPeriSinIVA(((gross * (periCostSale + 100)) / 100).toFixed(2)); }
      else {setPeriSinIVA(((gross * (periCostSale + 100)) / 100).toFixed(2));}

    }

      if(superPrice==0)
      { 
        
      if (productSelected?.SupercomproConIVA ) { setSupercomproConIVA(((((gross) * (supercomproCostSale + 100)) / 100) * (((100 + (Number(itmDiscounts?.find(q => q.gtin == productSelected?.gtin && q.ruleType == 'TAX')?.value ?? 0))) / 100))).toFixed(2));}
      else {setSupercomproConIVA(((((gross) * (supercomproCostSale + 100)) / 100) * (((100 + (Number(itmDiscounts?.find(q => q.gtin == productSelected?.gtin && q.ruleType == 'TAX')?.value ?? 0))) / 100))).toFixed(2));}

      if (productSelected?.SupercomproSinIVA ) { setSupercomproSinIVA((((gross) * (supercomproCostSale + 100)) / 100).toFixed(2));}
      else {setSupercomproSinIVA((((gross) * (supercomproCostSale + 100)) / 100).toFixed(2));}

    }

      if(sarettoPrice==0)
      { 
            
      if (productSelected?.SarettoConIVA ) {  setSarettoConIVA(((((gross) * (sarettoCostSale + 100)) / 100) * (((100 + (Number(itmDiscounts?.find(q => q.gtin == productSelected?.gtin && q.ruleType == 'TAX')?.value ?? 0))) / 100))).toFixed(2));}
      else {     setSarettoConIVA(((((gross) * (sarettoCostSale + 100)) / 100) * (((100 + (Number(itmDiscounts?.find(q => q.gtin == productSelected?.gtin && q.ruleType == 'TAX')?.value ?? 0))) / 100))).toFixed(2));}

      if (productSelected?.SarettoSinIVA ) { setSarettoSinIVA((((gross) * (sarettoCostSale + 100)) / 100).toFixed(2));}
      else {setSarettoSinIVA((((gross) * (sarettoCostSale + 100)) / 100).toFixed(2));}
          
    }
      

      if(superviquezPrice==0)
      { 
      if (productSelected?.superviquezConIVA ) { setSuperviquezConIVA(((((gross) * (superviquezCostSale + 100)) / 100) * (((100 + (Number(itmDiscounts?.find(q => q.gtin == productSelected?.gtin && q.ruleType == 'TAX')?.value ?? 0))) / 100))).toFixed(2));}
      else {setSuperviquezConIVA(((((gross) * (superviquezCostSale + 100)) / 100) * (((100 + (Number(itmDiscounts?.find(q => q.gtin == productSelected?.gtin && q.ruleType == 'TAX')?.value ?? 0))) / 100))).toFixed(2));}

      if (productSelected?.superviquezSinIVA ) { setSuperviquezSinIVA(((gross * (superviquezCostSale + 100)) / 100).toFixed(2));}
      else {setSuperviquezSinIVA(((gross * (superviquezCostSale + 100)) / 100).toFixed(2));}      
      }
                
            
          
      // console.log('Valores gross, periCostSale',gross,periCostSale)
      // console.log('valor despues:',periConIVA)

            //alert('SE ACTIVO DESCUENTO')
    }
    loadInfo();
  }, [fijo,confidencial,grossCostAmount])      //[confidencial, introduccion, fijo, promocional,ddc,nodevolucion])



  useEffect( () => {
    

    const productSelected = products.find(q => q.gtin == openProduct);

    setTipoRegistroIdSelected(Number(productSelected?.TipoRegistro_ID))
    setBuyerTypeSelected(Number(productSelected?.TipoCompraId));
    setIdSegmentacionSelected(Number(productSelected?.SegmentacionArticulo));
    setIdAreaManejoSelected(Number(productSelected?.AreaManejo))

   
   
    
    setSubCategoryIdSelected(Number(productSelected?.SubCategoryId))
   
  
 

    
 


    console.log('productSelected ------------------>',productSelected)

  }, [!openProduct]) 




// --------------------------------------------------------------------------------------------------------
// MANEJADOR DEL CLIC DE LINEA DE PRODUCTOS 
// --------------------------------------------------------------------------------------------------------

const handleOpenProduct = async (productId: string,catego:number): Promise<void> => {

  

    setOpenProduct((prevValue) => (prevValue === productId ? null : productId));
    const data = await productApi.getBuyerTypes();
    const discounts = await productApi.getItemDicounts(productId);

    const dataSubcate = await productApi.getSubCategories(catego ?? 0);
    setSubCategories(dataSubcate)
    setCategoryIdSelected(catego ?? 0)

    setItmDiscounts(discounts);
    setBuyerTypes(data);

   

console.log('VALUE',openProduct)
console.log('PREV VALUE',productId)
   


    const productSelected = products.find(q => q.gtin == productId);
//alert('-' + productSelected?.RetornoProceso + '-')
if(productSelected?.RetornoProceso.trim()  != '')

{
    if(!openProduct && productSelected?.RetornoProceso!=user.UserType) 
    {
      alert('Estimado Usuario, este producto se mantendra deshabilitado al ser devuelto a Proveedor y-o Asistente')

    }
    if(!openProduct && productSelected?.RetornoProceso==user.UserType) 
    {
      alert('Estimado Usuario, Este producto se devolvió para reingreso de datos!')

    }

  }

    const gross = grossCost(productSelected, discounts);


   
    
    console.log('PARAMETROS DE FOTOS', dataSubcate)


   

  // arriba la carga de fotos anterior
  
   //alert(gross)
  // setGrossCostAmount(redondeo(gross) )
setGrossCostAmount(gross )

    if (productSelected?.SupercomproConIVA) {
      setSupercomproConIVA(productSelected?.SupercomproConIVA.toString())
    }
    else {
      setSupercomproConIVA(((((gross) * (supercomproCostSale + 100)) / 100) * (((100 + (Number(itmDiscounts?.find(q => q.gtin == productSelected?.gtin && q.ruleType == 'TAX')?.value ?? 0))) / 100))).toFixed(2));
    }
    if (productSelected?.SupercomproSinIVA) {
      setSupercomproSinIVA(productSelected?.SupercomproSinIVA.toString())
    }
    else {
      setSupercomproSinIVA((((gross) * (supercomproCostSale + 100)) / 100).toFixed(2));
    }
    if (productSelected?.SarettoSinIVA) {
      setSarettoSinIVA(productSelected?.SarettoSinIVA.toString())
    }
    else {
      setSarettoSinIVA((((gross) * (sarettoCostSale + 100)) / 100).toFixed(2));
    }
    if (productSelected?.SarettoConIVA) {
      setSarettoConIVA(productSelected?.SarettoConIVA.toString())
    }
    else {
      setSarettoConIVA(((((gross) * (sarettoCostSale + 100)) / 100) * (((100 + (Number(itmDiscounts?.find(q => q.gtin == productSelected?.gtin && q.ruleType == 'TAX')?.value ?? 0))) / 100))).toFixed(2));
    }

//alert('Paso 3')
    if (productSelected?.PeriConIVA) {
      setPeriConIVA(productSelected?.PeriConIVA.toString())
      console.log('peri con iva if',periConIVA)
      //alert('paso 3.1')
    }
    else {
      
      setPeriConIVA(((((gross) * (periCostSale + 100)) / 100) * (((100 + (Number(itmDiscounts?.find(q => q.gtin == productSelected?.gtin && q.ruleType == 'TAX')?.value ?? 0))) / 100))).toFixed(2));
      console.log('peri con iva else',periConIVA)
    }
    if (productSelected?.PeriSinIVA) {
      setPeriSinIVA(productSelected?.PeriSinIVA.toString())
    }
    else {
      setPeriSinIVA(((gross * (periCostSale + 100)) / 100).toFixed(2));
    }


    if (productSelected?.superviquezConIVA) {
      setSuperviquezConIVA(productSelected?.superviquezConIVA.toString())
    }
    else {
      setSuperviquezConIVA(((((gross) * (superviquezCostSale + 100)) / 100) * (((100 + (Number(itmDiscounts?.find(q => q.gtin == productSelected?.gtin && q.ruleType == 'TAX')?.value ?? 0))) / 100))).toFixed(2));
    }
    if (productSelected?.superviquezSinIVA) {
      setSuperviquezSinIVA(productSelected?.superviquezSinIVA.toString())
    }
    else {
      setSuperviquezSinIVA(((gross * (superviquezCostSale + 100)) / 100).toFixed(2));
    }


    console.log('EL PRODUCTO CARGADO',productSelected)

    setPrice(productSelected?.PriceFixed ?? 0);
    setPeriPrice(productSelected?.periPrice ?? 0);
    setSuperPrice(productSelected?.superPrice ?? 0);
    setSarettoPrice(productSelected?.sarettoPrice ?? 0);
    setSuperviquezPrice(productSelected?.superviquezPrice ?? 0)
    setItemFileCod(productSelected?.gtinItemFile ?? "")
    setComercialLongDescription(productSelected?.ComercialLongDescription ?? "");
    setComercialShortDescription(productSelected?.ComercialShortDescription ?? "");
    setComercialPubliDescription(productSelected?.ComercialPubliDescription ?? "");
    setComercialHablaDescription(productSelected?.ComercialHablaDescription ?? "");
    setComercialFonetDescription(productSelected?.ComercialFonetDescription ?? "");
    setPeriCostSale(productSelected?.PeriCostSale ?? 0);
    setSupercomproCostSale(productSelected?.SupercomproCostSale ?? 0);
    setSarettoCostSale(productSelected?.SarettoCostSale ?? 0);
    setSuperviquezCostSale(productSelected?.superviquezCostSale  ?? 0);
    setPeriCostUtility(productSelected?.PeriCostUtility ?? 0);
    setSupercomproCostUtility(productSelected?.SupercomproCostUtility ?? 0);
    setSarettoCostUtility(productSelected?.SarettoCostUtility ?? 0);
    setSuperviquezCostUtility(productSelected?.superviquezCostUtility ?? 0);
    setperimercadosSelected(productSelected?.PerimercadosPOS?.split(',') ?? [])
    setsarettoSelected(productSelected?.SarettoPOS?.split(',') ?? [])
    setsupercomproSelected(productSelected?.SupercomproPOS?.split(',') ?? [])
    setsuperviquezSelected(productSelected?.SuperViquezPOS?.split(',') ?? [])
    setAmountCosto(productSelected?.amount?.toString() ?? '0');

    setTipoRegistroIdSelected(Number(productSelected?.TipoRegistro_ID))
    setBuyerTypeSelected(Number(productSelected?.TipoCompraId));

    setIdSegmentacionSelected(Number(productSelected?.SegmentacionArticulo));
    setIdAreaManejoSelected(Number(productSelected?.AreaManejo))
    setSubCategoryIdSelected(Number(productSelected?.SubCategoryId))
  

   

    setProyMenVtasUni(productSelected?.ProyMenVtasUni ?? 0);
    setProyMenVtasCol(productSelected?.ProyMenVtasCol ?? 0);
    setSkuSustitucionSelected(productSelected?.skuSustitucion ?? '');

    setUbicacionCedi(productSelected?.UbicacionCedi ?? '');

   


    if (discounts) {
      setConfidencial(discounts.find(q => q.ruleCode == 'CONFIDENCIAL')?.value ?? '');
  
      setIntroduccion(discounts.find(q => q.ruleCode == 'INTRODUCCION')?.value ?? '');
      setFijo(discounts.find(q => q.ruleCode == 'FIJO')?.value ?? '');
      setPromocional(discounts.find(q => q.ruleCode == '?')?.value ?? '');
      setDDC(discounts.find(q => q.ruleCode == 'DDC')?.value ?? '');  
      setNoDevolucion(discounts.find(q => q.ruleCode == 'NO DEVOLUCION')?.value ?? '');  
// ****
      setdescuentoFijo(Number(discounts.find(q => q.ruleCode == 'NO DEVOLUCION')?.value) ?? 0); 

      setTAX(discounts.find(q => q.ruleCode == 'IMPUESTO')?.value ?? '');
    }

    console.log('Descuentos')
    console.log(confidencial,introduccion,fijo,promocional,ddc,descuentoFijo,tax)

    // ****
    //  setConfidencial(confidencial)
    // setConfidencial('0')

    

    if(!openProduct)  {

      const id= toast.loading('Cargando Fotos...')
      const fotos = await productApi.getFotos(productSelected!.glnOfManufacturer,productSelected!.gtin,cambioPrecios);
   
      toast.dismiss(id)

    // console.log('LAS FOTICOS',fotos)
     //console.log('LA FOTO',fotos[0].FotoProductoFrente)
,
     setfoto1(fotos[0].FotoProductoFrente ? b64DecodeUnicode(fotos[0].FotoProductoFrente): '/static/mock-images/covers/caja.png')
    // setfoto2(fotos[0].FotoProductoLado ? b64DecodeUnicode(fotos[0].FotoProductoLado): '/static/mock-images/covers/caja.png')
    // setfoto3(fotos[0].FotoProducto5 ? b64DecodeUnicode(fotos[0].FotoProducto5): '/static/mock-images/covers/caja.png')
    // setfoto4(fotos[0].FotoProducto4 ? b64DecodeUnicode(fotos[0].FotoProducto4): '/static/mock-images/covers/caja.png')
    // setfoto5(fotos[0].FotoProducto5 ? b64DecodeUnicode(fotos[0].FotoProducto5): '/static/mock-images/covers/caja.png')
  }

  else
  {
    setfoto1('/static/mock-images/covers/caja.png')
  }

  };

// FIN DE CARGA POR LINEA
// INICIO DE MANEJADORES

function redondeo(valor:number) {


let divisor = 0;

if(valor <= 500)  {divisor = 10}

if(valor > 500 && valor <= 1000)  {divisor = 25}
else 
if(valor > 1000 && valor <= 2000)  {divisor = 50}
else
if(valor > 2000 && valor <= 5000)  {divisor = 100}
else
if(valor > 5000 && valor <= 10000)  {divisor = 250}
else
if(valor > 10000 )  {divisor = 500}

 
let newvalor =  Math.round( valor / divisor) * divisor
 

  return newvalor
}




  const handleComercialShortDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setComercialShortDescription(event.target.value);
  }

  const handleComercialPubliDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setComercialPubliDescription(event.target.value);
  }

  const handleComercialFonetDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setComercialFonetDescription(event.target.value);
  }

  const handleComercialHablaDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setComercialHablaDescription(event.target.value);
  }

  const handleConfidencialDiscountChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfidencial(event.target.value);
    console.log('desc fijo', confidencial)
  }

  const handleAmountCosto = (event: ChangeEvent<HTMLInputElement>) => {
    setAmountCosto(event.target.value);
  }

  const handleUbicacionCEDIChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUbicacionCedi(event.target.value);
  }

  const handleDCsfecha = (newValue: Date | null): void => {
    
    console.log('NEWVALUE-------------->',newValue)
    console.log('Convertido:',newValue!.toDateString())
    //setFecha(startDate!.toLocaleString().replace(',',''))
    
    setDcsdate(newValue)
  };

  const handleDCefecha = (newValue: Date | null): void => {
     setDcedate(newValue)
  };

  const handleDFIsfecha = (newValue: Date | null): void => {
     setDfisdate(newValue)
  };
  const handleDFIefecha = (newValue: Date | null): void => {
    setDfiedate(newValue)
 };

 const handleDDCsfecha = (newValue: Date | null): void => {
  setDdcsdate(newValue)
};
const handleDDCefecha = (newValue: Date | null): void => {
 setDdcedate(newValue)
};


const handleDEIsfecha = (newValue: Date | null): void => {
  setDeisdate(newValue)
 // alert(newValue )

 const fecha4 = addMonths(newValue! , 4)
 //alert(fecha4)
  setDeiedate(fecha4)
};
const handleDEIefecha = (newValue: Date | null): void => {
 setDeiedate(newValue)
};

const handleDNDsfecha = (newValue: Date | null): void => {
  setDndsdate(newValue)
};
const handleDNDefecha = (newValue: Date | null): void => {
 setDndedate(newValue)
};

const handleTAXsfecha = (newValue: Date | null): void => {
  setTaxsdate(newValue)
};
const handleTAXefecha = (newValue: Date | null): void => {
 setTaxedate(newValue)
};

  const handleNoDevolucionDiscountChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNoDevolucion(event.target.value);
  }
  const handleIntroduccionDiscountChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIntroduccion(event.target.value);






    
    console.log('desc fijo', confidencial)
  }
  const handleFijoDiscountChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFijo(event.target.value);
  
  }
  const handlePromocionalDiscountChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPromocional(event.target.value);
  }

  const handleDDCDiscountChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDDC(event.target.value);
  }

  const handleTAXChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTAX(event.target.value);
  }

  const handlePeriCostUtilityChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPeriCostUtility(Math.round(Number(event.target.value)));
  }
  

  const handleitemFileCod = (event: ChangeEvent<HTMLInputElement>) => {
    setItemFileCod(event.target.value);
    console.log('ITEM CODIGO',itemFileCod)
  }
  const handleSupercomproCostUtilityChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSupercomproCostUtility(Number(Number(event.target.value).toFixed(2)));
  }
  const handleComercialLongDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setComercialLongDescription(event.target.value);

    console.log('digitando long description:',event.target.value)
  }
  const handleSarettoCostSaleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const val = (Number(Number(event.target.value).toFixed(2)));
    setSarettoCostSale(val);
    const resultSinIVA = (grossCostAmount * ((val + 100) / 100));
    const tax = (Number(itmDiscounts?.find(q => q.gtin == openProduct && q.ruleType == 'TAX')?.value ?? 0) / 100) + 1;
    setSarettoConIVA((resultSinIVA * tax).toFixed(2));
    setSarettoSinIVA(resultSinIVA.toFixed(2));
  }
  

  const handleSuperViquezPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const price = Number(event.target.value);
    setSuperviquezPrice(price);
    const tax = Number(itmDiscounts?.find(q => q.gtin == openProduct && q.ruleType == 'TAX')?.value ?? 0);
    
    const precioSinIVA = (price / (1 + (tax / 100)));
    

    setSuperviquezSinIVA(precioSinIVA.toFixed(2));
    setSuperviquezConIVA(price.toFixed(2));
    setSuperviquezCostUtility(Number(((((precioSinIVA - grossCostAmount) / grossCostAmount) * 100)).toFixed(2)))
    setSuperviquezCostSale(Number(((((precioSinIVA - grossCostAmount) / grossCostAmount) * 100)).toFixed(2)))
    // setSuperviquezCostSale(Number((((precioSinIVA - grossCostAmount) / precioSinIVA) * 100).toFixed(2)))
    
    }

  
  

  const handleSarettoPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const price = Number(event.target.value);
    setSarettoPrice(price);
    const tax = Number(itmDiscounts?.find(q => q.gtin == openProduct && q.ruleType == 'TAX')?.value ?? 0);
    const precioSinIVA = (price / (1 + (tax / 100)));
    setSarettoSinIVA(precioSinIVA.toFixed(2));
    setSarettoConIVA(price.toFixed(2));
    setSarettoCostUtility(Number(((((precioSinIVA - grossCostAmount) / grossCostAmount) * 100)).toFixed(2)))
    setSarettoCostSale(Number(((((precioSinIVA - grossCostAmount) / grossCostAmount) * 100)).toFixed(2)))
  }
  const handleSuperPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const price = Number(event.target.value);
    setSuperPrice(price);
    const tax = Number(itmDiscounts?.find(q => q.gtin == openProduct && q.ruleType == 'TAX')?.value ?? 0);
    const precioSinIVA = (price / (1 + (tax / 100)));
    setSupercomproSinIVA(precioSinIVA.toFixed(2));
    setSupercomproConIVA(price.toFixed(2));
    setSupercomproCostUtility(Number(((((precioSinIVA - grossCostAmount) / grossCostAmount) * 100).toFixed(2))))
    setSupercomproCostSale(Number(((((precioSinIVA - grossCostAmount) / grossCostAmount) * 100)).toFixed(2)))
  }
  const handlePeriPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const price = Number(event.target.value);
    setPeriPrice(price);
    const tax = Number(itmDiscounts?.find(q => q.gtin == openProduct && q.ruleType == 'TAX')?.value ?? 0);
    const precioSinIVA = (price / (1 + (tax / 100)));
    setPeriSinIVA(precioSinIVA.toFixed(2));
    setPeriConIVA(price.toFixed(2));
    setPeriCostUtility(Number(((((precioSinIVA - grossCostAmount) / grossCostAmount) * 100).toFixed(2))))
    setPeriCostSale(Number(((((precioSinIVA - grossCostAmount) / grossCostAmount) * 100)).toFixed(2)))
  }
  const handleChangePOSSuperCompro = (event: SelectChangeEvent<typeof supercomproSelected>) => {
    const {
      target: { value },
    } = event;
    setsupercomproSelected(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  const handleChangePOSPerimercados = (event: SelectChangeEvent<typeof perimercadosSelected>) => {
    const {
      target: { value },
    } = event;
    setperimercadosSelected(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleChangePOSSuperviquez = (event: SelectChangeEvent<typeof superviquezSelected>) => {
    const {
      target: { value },
    } = event;
    setsuperviquezSelected(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };


  const handleChangePOSSaretto = (event: SelectChangeEvent<typeof sarettoSelected>) => {
    const {
      target: { value },
    } = event;
    setsarettoSelected(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 100,
      },
    },
  };

  const supercompro = pos.filter(q => q.puntoVenta_dsc.includes('SUPER COMPRO')).map(q => `${q.puntoVenta_dsc}`)
  const perimercados = pos.filter(q => q.puntoVenta_dsc.includes('PERI')).map(q => `${q.puntoVenta_dsc}`)
  const superviquez = pos.filter(q => q.puntoVenta_dsc.includes('SUPER VIQUEZ')).map(q => `${q.puntoVenta_dsc}`)
  const saretto = pos.filter(q => q.puntoVenta_dsc.includes('SARETTO')).map(q => `${q.puntoVenta_dsc}`)
  const [perimercadosSelected, setperimercadosSelected] = useState<string[]>([]);
  const [superviquezSelected, setsuperviquezSelected] = useState<string[]>([]);
  const [perichecked, setPeriChecked] = useState(false);
  const [superviquezchecked, setSuperviquezChecked] = useState(false);
  const [supercomproConIVA, setSupercomproConIVA] = useState<string>("0");
  const [supercomproSinIVA, setSupercomproSinIVA] = useState<string>("0");
  const [sarettoConIVA, setSarettoConIVA] = useState<string>("0");
  const [sarettoSinIVA, setSarettoSinIVA] = useState<string>("0");
  const [superviquezConIVA, setSuperviquezConIVA] = useState<string>("0");
  const [superviquezSinIVA, setSuperviquezSinIVA] = useState<string>("0");
  const [periConIVA, setPeriConIVA] = useState<string>("0");
  const [periSinIVA, setPeriSinIVA] = useState<string>("0");
  const [supercomprochecked, setSupercomproChecked] = useState(false);
  const [sarettochecked, setSarettoChecked] = useState(false);
  const [supercomproSelected, setsupercomproSelected] = useState<string[]>([]);
  const [sarettoSelected, setsarettoSelected] = useState<string[]>([]);

  function b64DecodeUnicode(str: any) {
    //console.log('str en b64 decode:',str)
    if (str) {
    return Buffer.from(str, "base64").toString("utf8")}
    else return ''};

    const BlogPostCardMediaWrapper = styled('div')({
      paddingTop: 'calc(100% * 4 / 4)',
      position: 'relative'
    });

    


  const handleChange = async (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event;
    const data = await productApi.getSubCategories(Number(value));
    setCategoryIdSelected(Number(value));
    setSubCategories(data)
  };


  const handleChangeSegmentacion = async (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event;
   
    setIdSegmentacionSelected(Number(value));
    
  };

  const handleChangeAreaManejo = async (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event;
   
    setIdAreaManejoSelected(Number(value));
    
  };

  const handleChangeMotivosRetornoItem = async (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event;
   
    setmotivosRetorno(value);
   // alert(value)
    
  };

  const handleChangeDevolverA = async (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event;
   
    setdevolverA(value);
  //  alert(value)
    
  };




  const handleProyMenVtasUniChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
   
    setProyMenVtasUni(Number(value));
    
  };


  const handleProyMenVtasColChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
   
    setProyMenVtasCol(Number(value));
    
  };






  const handleSupercomproCostSaleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const val = Math.round(Number(event.target.value));
    setSupercomproCostSale(val);
    const resultSinIVA = (grossCostAmount * ((val + 100) / 100));
    const tax = (Number(itmDiscounts?.find(q => q.gtin == openProduct && q.ruleType == 'TAX')?.value ?? 0) / 100) + 1;
    setSupercomproConIVA((resultSinIVA * tax).toFixed(2));
    setSupercomproSinIVA(resultSinIVA.toFixed(2));
  }

  const handleSuperviqueaCostSaleChange = (event: ChangeEvent<HTMLInputElement>) => {
   
    const val = Number(event.target.value);
    setSuperviquezCostSale(val);
    const resultSinIVA = (grossCostAmount * ((val + 100) / 100));
    const tax = (Number(itmDiscounts?.find(q => q.gtin == openProduct && q.ruleType == 'TAX')?.value ?? 0) / 100) + 1;
    setSuperviquezConIVA((resultSinIVA * tax).toFixed(2));
    setSuperviquezSinIVA(resultSinIVA.toFixed(2));
  }

  const handlePeriCostSaleChange = (event: ChangeEvent<HTMLInputElement>) => {
    //alert('alerta 1')
    const val = Number(event.target.value);
    setPeriCostSale(val);
    const resultSinIVA = (grossCostAmount * ((val + 100) / 100));
    const tax = (Number(itmDiscounts?.find(q => q.gtin == openProduct && q.ruleType == 'TAX')?.value ?? 0) / 100) + 1;
    setPeriConIVA((resultSinIVA * tax).toFixed(2));
    setPeriSinIVA(resultSinIVA.toFixed(2));
  }

  

  const handleBuyerTypeChange = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event;
    setBuyerTypeSelected(Number(value));
    // alert(buyerTypeSelected)
  };

  const handleSkuSustitucionTypeChange = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event;
    setSkuSustitucionSelected(value);
  };

  const handleSarettoCostUtilityChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSarettoCostUtility(Number(event.target.value));
  }

  const handlesuperviquezCostUtilityChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSuperviquezCostUtility(Number(event.target.value));
  }

  const handleSubcategoryChange = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event;
    setSubCategoryIdSelected(Number(value));

  };

  const handleTipoRegistroChange = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event;
    setTipoRegistroIdSelected(Number(value));

  };


  const handleReject = async () => {
    
    if (confirm('Desea rechazar este producto?' + openProduct) == true) 
    {
    await productApi.addStatusProduct(openProduct ?? "", ProductStatus.REJECT);
    toast.success('Producto rechazado');
    router.reload();}
    
  }


  const handleAccept = async () => {
    if (confirm( user.UserType == "2" ? 'Desea enviar producto a ADC?' :'Desea actualizar y aprobar este producto?') == true) 
    {
      if (user.UserType != "2") { handleUpdateComercialDataProduct();}
    await productApi.addStatusProduct(openProduct ?? "", ProductStatus.ACCEPT);
    toast.success('Producto actualizado y aceptado!');
    router.reload();
    }
  }

  const handleExecRetorno = async () => {

    if ((confirm('Desea devolver este producto al ' + (devolverA=='3' ? 'Proveedor?' : devolverA=='2' ? 'Asistente?' : 'ADC?') ) == true) )
    {
       await productApi.createRetorno(openProduct  ?? "",motivosRetorno,'I',devolverA)
    }

    toast.success('Producto regresado!');
    router.reload();
    
  }
 
  const handleUpdateComercialDataProduct = async () => {
   await productApi.updateProductComercialData(openProduct ?? "", comercialLongDescription,
      comercialShortDescription,comercialPubliDescription,comercialFonetDescription,comercialHablaDescription, 
      periCostSale, periCostUtility, sarettoCostSale, sarettoCostUtility,
      supercomproCostUtility, posID ?? -1, supercomproCostSale, perimercadosSelected.join(','),
      sarettoSelected.join(','), supercomproSelected.join(','), 
      price, 0,0,0,
      // superPrice, sarettoPrice, periPrice,
      Number(periSinIVA), Number(periConIVA), Number(supercomproSinIVA), Number(supercomproConIVA),
      Number(sarettoSinIVA), Number(sarettoConIVA), Number(confidencial), Number(introduccion), Number(fijo), 
      Number(promocional),Number(ddc),Number(nodevolucion) ,
      superviquezCostSale, superviquezCostUtility,0,Number(superviquezSinIVA), 
      Number(superviquezConIVA), superviquezSelected.join(','),Number(IdSegmentacionSelected),
      Number(tipoRegistroIdSelected),Number(buyerTypeSelected),Number(IdAreaManejoSelected),UbicacionCedi, ProyMenVtasUni, ProyMenVtasCol, checked
      
      );
      await productApi.updateDiscounts( openProduct ?? "",'PCD','DC',confidencial,'A',dcsdate!.toISOString(),dcedate!.toISOString(),'4')  
      await productApi.updateDiscounts( openProduct ?? "",'PCD','DEI',introduccion,'A',deisdate!.toISOString(),deiedate!.toISOString(),'2')  
      await productApi.updateDiscounts( openProduct ?? "",'PCD','DFI',fijo,'A',dfisdate!.toISOString(),dfiedate!.toISOString(),'1')  
      await productApi.updateDiscounts( openProduct ?? "",'PCD','DND',descuentoFijo.toString(),'A',dndsdate!.toISOString(),dndedate!.toISOString(),'6')  
      await productApi.updateDiscounts( openProduct ?? "",'PCD','DDC',ddc,'A',ddcsdate!.toISOString(),ddcedate!.toISOString(),'5')  
      //await productApi.updateDiscounts( openProduct ?? "",'PCD','PAI',confidencial,'','','3','A')  
      //await productApi.updateDiscounts( openProduct ?? "",'PCD','TD',confidencial,'','','4','A')  
      await productApi.updateDiscounts( openProduct ?? "",'TAX','01',tax,'C',taxsdate!.toISOString(),taxedate!.toISOString(),'1')  


      await productApi.createRetorno(openProduct  ?? "",'','A',user.UserType)
    
        
    

      console.log('USUARIO',user.UserType)

      console.log(':::::::::::::::::::',IdSegmentacionSelected)
    
      if (user.UserType == "2" ) {
      
              if (comercialLongDescription && comercialLongDescription.length > 1 
                               && comercialShortDescription && comercialShortDescription.length > 1 
                               && comercialPubliDescription && comercialPubliDescription.length > 1
                               && comercialFonetDescription && comercialFonetDescription.length > 1
                               && comercialHablaDescription && comercialHablaDescription.length > 1
                               && IdSegmentacionSelected   && tipoRegistroIdSelected && buyerTypeSelected && (buyerTypeSelected==2 ? IdAreaManejoSelected: true ))
                               
                                {
                                   handleAccept();
                                }    else  {

                                 console.log(IdSegmentacionSelected,tipoRegistroIdSelected,buyerTypeSelected,IdAreaManejoSelected) 

                                 alert('Debe completar todos los campos del formulario!')
                                 return 

                                 }


    }
    setComercialLongDescription('');
    setComercialShortDescription('');
    setComercialPubliDescription('');
    setComercialFonetDescription('');
    setComercialHablaDescription('');

    setSuperviquezCostSale(0);
    setSuperviquezCostUtility(0);
    setSuperviquezPrice(0);
    setPeriCostSale(0);
    setPeriCostUtility(0);
    setSupercomproCostSale(0);
    setSupercomproCostUtility(0);
    setSarettoCostSale(0);
    setPeriPrice(0);
    setSuperPrice(0);
    setSarettoPrice(0);
    setSarettoCostUtility(0);
    setPosID(null);
    setProyMenVtasCol(0);
    setProyMenVtasUni(0);

    toast.success('Producto actualizado!');
    router.reload();
  }

  //
  const handleUpdateITM = async (): Promise<void> => {
    console.log('ITEM FILE DE NUEVO',itemFileCod)
    if(!itemFileCod)
    { 
      alert('Debe especificar un Item Code!')
      return

    }
    if ((confirm('Desea actualizar Item Code?') == true) )
      {
          
         await productApi.updateCode(openProduct ?? "", itemFileCod ?? "").then(() => 
          
          {
                setItemFileCod("");
                
           })


        

                toast.success('Producto actualizado con Item Code');
                router.reload();
  }
  };

  const handleGeneraExcel = async (): Promise<void> => {
    console.log('ITEM FILE DE NUEVO',itemFileCod)
    if ((confirm('Desea Exportar datos de Articulo: '  +openProduct+ ' a Excel?') == true) )
      {
          
        
        
           const dataExcel = await productApi.LoadProdutos(openProduct!);
           const dataExcelNlo = await productApi.LoadProdutosNlo(openProduct!);
           const dataExcelPre = await productApi.LoadProdutosPre(openProduct!);
           const dataExcelProv = await productApi.LoadProdutosProv(openProduct!);
           const dataExcelPdv = await productApi.LoadProdutosPdv(openProduct!);

        
         
                
                const worksheet = XLSX.utils.json_to_sheet(dataExcel!);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Articulo Nuevo");

                const worksheet2 = XLSX.utils.json_to_sheet(dataExcelNlo!);
                //const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet2, "Articulo Nuevo Logistica");

                const worksheet3 = XLSX.utils.json_to_sheet(dataExcelPre!);
                //const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet3, "Articulo Presente");

                const worksheet4 = XLSX.utils.json_to_sheet(dataExcelProv!);
                //const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet4, "Articulo Proveedor");

                const worksheet5 = XLSX.utils.json_to_sheet(dataExcelPdv!);
                //const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet5, "Puntos de Venta");


                // Buffer to store the generated Excel file
                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

                saveAs(blob, "data_" + openProduct + ".xlsx");

                toast.success('Excel descargado!');
                router.reload();
              }
  };



  const handleUpdateProduct = async (): Promise<void> => {
    // SE AGREGO CAPTURA DEL COSTO DEL PRODUCTO QUE SE APLICA EN EL CAMPO amount      NEW

    // console.log(openProduct,confidencial,introduccion,fijo,nodevolucion,ddc,tax)
    // console.log('convertida la fecha',dcsdate!.toLocaleDateString())
    // console.log(categoryIdSelected,subCategoryIdSelected,tipoRegistroIdSelected,buyerTypeSelected,amountCosto)



if(cambioPrecios)
    {
      if ((confirm('Desea actualizar precio del producto y re-enviarlo a Gessa?') == true) )
      {
      
        await productApi.updateProductCambioPrecios(openProduct ?? "",amountCosto).then(() => {
            setAmountCosto('0')
      })
      toast.success('Producto actualizado para cambio precio');
      router.reload();
    }
    
    }

  
else 
{

      
      
  

    if ((categoryIdSelected && subCategoryIdSelected  && (Number(amountCosto) > 0) && (!checkedSKU || (checkedSKU && skuSustitucionSelected != '') )  ))
    {
    if ((confirm('Desea actualizar producto y enviarlo a Gessa? ' ) == true) )
    {
    
       
      //await productApi.updateProduct(openProduct ?? "", Number(categoryIdSelected), Number(subCategoryIdSelected), Number(tipoRegistroIdSelected),Number(buyerTypeSelected),foto1,foto2,foto3,foto4,foto5, Number(amountCosto), checked).then(() => {
               
    
                await productApi.updateProduct(openProduct ?? "", Number(categoryIdSelected), Number(subCategoryIdSelected), Number(tipoRegistroIdSelected),
                                               Number(buyerTypeSelected),foto1,foto2,foto3,foto4,foto5, Number(amountCosto), 
                                               checked,aceptaDevolucion, checkedSKU ?   skuSustitucionSelected : '').then(() => {
                  setOpenProduct(null);
                  setBuyerTypeSelected(null);
                  setCategoryIdSelected(null);
                  setSubCategoryIdSelected(null);
                  setTipoRegistroIdSelected(null);
                  setSkuSustitucionSelected('');
                  setPrice(0);
                  setPeriPrice(0);
                  setSuperPrice(0);
                  setSarettoPrice(0);
                  setSuperviquezPrice(0);
                  setAmountCosto('0');
                
                })

                await productApi.createRetorno(openProduct  ?? "",'','A',user.UserType)

                await productApi.updateDiscounts( openProduct ?? "",'PCD','DC',confidencial,'A',dcsdate!.toISOString(),dcedate!.toISOString(),'4')  
                await productApi.updateDiscounts( openProduct ?? "",'PCD','DEI',introduccion,'A',deisdate!.toISOString(),deiedate!.toISOString(),'2')  
                await productApi.updateDiscounts( openProduct ?? "",'PCD','DFI',fijo,'A',dfisdate!.toISOString(),dfiedate!.toISOString(),'1')  
                await productApi.updateDiscounts( openProduct ?? "",'PCD','DND',descuentoFijo.toString(),'A',dndsdate!.toISOString(),dndedate!.toISOString(),'6')  
                await productApi.updateDiscounts( openProduct ?? "",'PCD','DDC',ddc,'A',ddcsdate!.toISOString(),ddcedate!.toISOString(),'5')  
                //await productApi.updateDiscounts( openProduct ?? "",'PCD','PAI',confidencial,'','','3','A')  
                //await productApi.updateDiscounts( openProduct ?? "",'PCD','TD',confidencial,'','','4','A')  
                await productApi.updateDiscounts( openProduct ?? "",'TAX','01',tax,'C',taxsdate!.toISOString(),taxedate!.toISOString(),'1')  


                toast.success('Producto actualizado');
                router.reload();

  } 
  } else {alert('Debe completar todos los campos!')}


}

  };


const togleModal = (): void => {

  setmodalRetorno(!modalRetorno)

}


  const handleCancelEdit = (): void => {
    setOpenProduct(null);
    setPrice(0);
    setBuyerTypeSelected(null);
    setCategoryIdSelected(null);
    setSubCategoryIdSelected(null);
    setComercialLongDescription('');
    setComercialShortDescription('');
    setComercialPubliDescription('');
    setPeriCostSale(0);
    setPeriCostUtility(0);
    setSupercomproCostSale(0);
    setSupercomproCostUtility(0);
    setSarettoCostSale(0);
    setSarettoCostUtility(0);
    setPeriPrice(0);
    setSuperPrice(0);
    setSarettoPrice(0);
    setPosID(null);
    setItmDiscounts(undefined);
  };
  const handlesupercomprochecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setsupercomproSelected(event.target.checked ? supercompro : [])
    setSupercomproChecked(event.target.checked);
  };
  const handlesarettochecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setsarettoSelected(event.target.checked ? saretto : [])
    setSarettoChecked(event.target.checked);
  };
  const handleperichecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setperimercadosSelected(event.target.checked ? perimercados : [])
    setPeriChecked(event.target.checked);
  };

  const handlesuperviquezchecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setsuperviquezSelected(event.target.checked ? superviquez : [])
    setSuperviquezChecked(event.target.checked);
  };
  const handleCheckedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleCheckedSKUChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedSKU(event.target.checked);
  };

  const handleCheckedAceptaDevolucion = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAceptaDevolucion(event.target.checked);
  };

  const grossCost = (product: Item | undefined, Discounts: ItemsDiscount[]): number => {

    if (!product) {
      return 0;
    }
    let productResult = product.amount ?? 0;
           
    //productResult = productResult - (productResult * Number(confidencial ?? 1)) / 100;
    //productResult = productResult - (productResult * Number(Discounts?.find(q => q.gtin == product.gtin && q.ruleCode == 'DDC')?.value ?? 0)) / 100;
    //productResult = productResult - (productResult * Number(fijo ?? 1)) / 100;


    let ieble = productResult * Number(fijo ?? 1) / 100; 

    // alert('aqui cargo promocional '+ confidencial)

    productResult = productResult - (productResult * descuentoFijo )
    productResult = productResult - (productResult * Number(introduccion ?? 1)) / 100; 
    productResult = productResult - (productResult * Number(confidencial ?? 1)) / 100;       // 190324
    productResult = productResult + ieble


    

    console.log('descuentos')
    console.log(descuentoFijo,introduccion,confidencial)
    console.log('CALCULOS:')
    console.log('descuentos')
    console.log(fijo,ieble,productResult)
   
    

    /* setPeriSinIVA(productResult.toFixed(2).toString()) 
    setPeriConIVA(((((productResult) * (periCostSale + 100)) / 100) * (((100 + (Number(itmDiscounts?.find(q => q.gtin == product?.gtin && q.ruleType == 'TAX')?.value ?? 0))) / 100))).toFixed(2));
    
    setSupercomproSinIVA(productResult.toFixed(2).toString()) 
    setSupercomproConIVA(((((productResult) * (periCostSale + 100)) / 100) * (((100 + (Number(itmDiscounts?.find(q => q.gtin == product?.gtin && q.ruleType == 'TAX')?.value ?? 0))) / 100))).toFixed(2));

    setSarettoSinIVA(productResult.toFixed(2).toString()) 
    setSarettoConIVA(((((productResult) * (periCostSale + 100)) / 100) * (((100 + (Number(itmDiscounts?.find(q => q.gtin == product?.gtin && q.ruleType == 'TAX')?.value ?? 0))) / 100))).toFixed(2));

    setSuperviquezSinIVA(productResult.toFixed(2).toString()) 
    setSuperviquezConIVA(((((productResult) * (periCostSale + 100)) / 100) * (((100 + (Number(itmDiscounts?.find(q => q.gtin == product?.gtin && q.ruleType == 'TAX')?.value ?? 0))) / 100))).toFixed(2));
 

 */

    
    // console.log('FIJO: ',productResult)

   // productResult = productResult - (productResult * Number(Discounts?.find(q => q.gtin == product.gtin && q.ruleCode == 'NO DEVOLUCION')?.value ?? 1)) / 100;
   //productResult = productResult - (productResult * Number(Discounts?.find(q => q.gtin == product.gtin && q.ruleCode == '?')?.value ?? 0)) / 100;
  
  /*  setfoto1(product.FotoProductoFrente ? b64DecodeUnicode(product.FotoProductoFrente): '/static/mock-images/covers/caja.png')
   setfoto2(product.FotoProductoLado ? b64DecodeUnicode(product.FotoProductoLado): '/static/mock-images/covers/caja.png')
   setfoto3(product.FotoProducto5 ? b64DecodeUnicode(product.FotoProducto5): '/static/mock-images/covers/caja.png')
   setfoto4(product.FotoProducto4 ? b64DecodeUnicode(product.FotoProducto4): '/static/mock-images/covers/caja.png')
   setfoto5(product.FotoProducto5 ? b64DecodeUnicode(product.FotoProducto5): '/static/mock-images/covers/caja.png') */

  //  console.log('Fotos',posts)

  //  setCategoryIdSelected(Number(product?.CategoryId))
  //  setSubCategoryIdSelected(Number(product?.SubCategoryId))
  //  setTipoRegistroIdSelected(Number(product?.TipoRegistro_ID))
  //  setBuyerTypeSelected(Number(product?.TipoCompraId));
  //  if(product.CompraEnUnidad) {
  //               setChecked(true)} 
  //               else 
  //               {setChecked(false)}
   
  //  console.log('LA CATEGORIA',categoryIdSelected)


    return productResult;
  }
  return (
    <div {...other}>
      <Scrollbar>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>
                SKU
              </TableCell>
              <TableCell>
                Marca
              </TableCell>
              <TableCell>
                Descripcion
              </TableCell>
              <TableCell>
                Proveedor
              </TableCell>
              <TableCell>
                Estado
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {

             


           // console.log('Foto mala........',product.FotoProductoArribaBAse)
           // console.log('Foto buena........',product.FotoProductoFrente)

              const open = product.gtin === openProduct;
              return (
                <Fragment key={product.gtin}>
                  <TableRow
                    hover
                    key={product.gtin}
                  >
                    <TableCell
                      padding="checkbox"
                      sx={{
                        ...(open && {
                          position: 'relative',
                          '&:after': {
                            position: 'absolute',
                            content: '" "',
                            top: 0,
                            left: 0,
                            backgroundColor: 'primary.main',
                            width: 3,
                            height: 'calc(100% + 1px)'
                          }
                        })
                      }}
                      width="25%"
                    >
                      <IconButton onClick={() => handleOpenProduct(product.gtin,Number(product.CategoryId))}>
                        {
                          open
                            ? <ChevronDownIcon fontSize="small" />
                            : <ChevronRightIcon fontSize="small" />
                        }
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      {product.gtin}
                    </TableCell>
                    <TableCell>
                      {product.brandName}
                    </TableCell>
                    <TableCell>
                      {product.descriptionShort}   <SeverityPill color='error'> {product.CambioPrecio? 'CAMBIO DE PRECIO!':''}   </SeverityPill>
                    </TableCell>
                    <TableCell>
                      {product.partyName}
                    </TableCell>
                    <TableCell>
                      
                      <SeverityPill color={product.Status == -1 ? 'error' : product.Status == 1 ? 'success' : 'secondary'}>
                        {product.Status == -1 ? 'Rechazado' 
                           : product.Status == 1 ? user.UserType == "1" ? 'Enviado x Asistente' 
                           : user.UserType == "4" ? 'Rev. ADC' 
                           : 'Aceptado' : 'Pendiente'}
                             {product.RetornoProceso =='3' ? '- ADC devuelve al Proveedor'  :  ''}
                             {product.RetornoProceso =='2' ? '- ADC devuelve al Asistente'  :  ''}
                      </SeverityPill> 
                    </TableCell>
                  </TableRow>
                  {open && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        sx={{
                          p: 0,
                          position: 'relative',
                          '&:after': {
                            position: 'absolute',
                            content: '" "',
                            top: 0,
                            left: 0,
                            backgroundColor: 'primary.main',
                            width: 3,
                            height: 'calc(100% + 1px)'
                          }
                        }}
                      >
                        {(user.UserType == "3") && (!product.CategoryId || product.gtinItemFile!.length > 0 || product.RetornoProceso == "3") && <Fragment>
                          <CardContent>
                            {/* podemos quitar esta parte para ver los combos y/o bloquear el mantenimiento respectivo */}
                            {(!cambioPrecios  &&       
                            <Grid
                              container
                              spacing={2}
                            >
                              <Grid
                                item
                                md={11}
                                xs={12}
                              >
                                   <SeverityPill color='info'>
                                <Typography variant="h6">
                                  Datos a actualizar
                                </Typography> </SeverityPill>
                                <Divider sx={{ my: 2 }} />
                                <Grid
                                  container
                                  spacing={3}>

                                  <Grid
                                    item
                                    md={6}
                                    xs={12}
                                  >
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label">Categoria</InputLabel>
                                      <Select
                                        id="demo-simple-select-label"
                                        value={categoryIdSelected?.toString()}
                                        onChange={handleChange}
                                        input={<OutlinedInput label="Categoria" />}
                                        MenuProps={MenuProps}
                                      >
                                        {categories && categories.sort((a,b)=> a.categoria_dsc.localeCompare(b.categoria_dsc)).map((name) => (
                                          <MenuItem key={name.categoria_id} value={name.categoria_id}>
                                            {name.categoria_dsc}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  <Grid
                                    item
                                    md={6}
                                    xs={12}
                                  >
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label">Subcategoria</InputLabel>
                                      <Select
                                        id="demo-simple-select-label"
                                        value={subCategoryIdSelected?.toString()}
                                        onChange={handleSubcategoryChange}
                                        input={<OutlinedInput label="Subcategoria" />}
                                        MenuProps={MenuProps}
                                      >
                                        {subCategories && subCategories.map((name) => (
                                          <MenuItem key={name.subcategoria_id} value={name.subcategoria_id}>
                                            {name.subcategoria_dsc}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </Grid>
                             

                             

                                  <Grid
                                    item
                                    md={6}
                                    xs={12}
                                  >
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 3
                                      }}
                                    >
                                      <div>
                                        <Typography variant="subtitle1">
                                          Desea indicar Sku de sustitucion
                                        </Typography>
                                      </div>
                                      <Switch checked={checkedSKU}
                                        onChange={handleCheckedSKUChange} />
                                    </Box>
                                  </Grid>

                                   <Grid
                                    item
                                    md={6}
                                    xs={12}
                                  >
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label">Sku de Sustitucion</InputLabel>
                                      <Select
                                        id="demo-simple-select-label"
                                        value={skuSustitucionSelected}
                                        disabled={!checkedSKU}
                                        onChange={handleSkuSustitucionTypeChange}
                                        input={<OutlinedInput label="Sku de Sustitucion" />}
                                        MenuProps={MenuProps}
                                      >
                                        {SkuSustituciones && SkuSustituciones.map((name) => (
                                          <MenuItem key={name.gtin} value={name.gtin}>
                                            {name.functionalName + ' ' + name.gtin}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </Grid> 
                                  </Grid> 

                                
                                <Grid mt={1}
                                  container
                                  spacing={3}
                                >
                                 

                                  <Grid
                                    item
                                    md={6}
                                    xs={12}
                                  >
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 3
                                      }}
                                    >
                                      <div>
                                        <Typography variant="subtitle1">
                                          Acepta Devolución
                                        </Typography>
                                      </div>
                                      <Switch checked={aceptaDevolucion}
                                        onChange={handleCheckedAceptaDevolucion} />
                                    </Box>
                                  </Grid>




                                </Grid>
                              </Grid>


                              
                            </Grid>
                          )}
{/* //   METER A PARTIR DE AQUI TODOS LOS DATOS DE COSTOS QUE ESTAN EN EL PROVEEDOR NO EWAY  */}

<Divider sx={{ my: 3 }} />

  <Grid
    item
    md={16}
    xs={12}
  >
     <SeverityPill color='info'>
    <Typography variant="h6">
      INFORMACION COMERCIAL PROVEEDOR
    </Typography>
    </SeverityPill>
    <Divider sx={{ my: 2 }} />
    <Grid
      container
      spacing={1}
    >
      <Grid item md={6} xs={12}>
        <table>
          <TableHead>
            <TableRow>
          
              <TableCell>DESCRIPCION</TableCell>
            
              
              <TableCell>MONTO %</TableCell>
              <TableCell>DESDE</TableCell>
              <TableCell>HASTA</TableCell>
            </TableRow>
           

          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                COSTO ¢
              </TableCell>
              <TableCell>
                {/* {product.amount?.toFixed(2)} */}
                <TextField type={'number'} disabled={user.UserType!="3"}
                      value={amountCosto}
                      onChange={handleAmountCosto}
                    />
              </TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                 DESCUENTO FIJO PROV. (%)
              </TableCell>
              <TableCell>
                {/* {product.amount?.toFixed(2)} */}
                <TextField type={' number'} disabled={true}
                      value={descuentoFijo}
                      
                    />
              </TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          
            <TableRow>
              {itmDiscounts && itmDiscounts.find(q => q.ruleCode == 'INTRODUCCION') &&
                <>
                  <TableCell>
                    {itmDiscounts.find(q => q.ruleCode == 'INTRODUCCION')?.ruleCode} (%)
                  </TableCell>
                  <TableCell>
                    <TextField type={'number'} disabled={user.UserType!="3"}
                      value={introduccion}
                      onChange={handleIntroduccionDiscountChange}
                    />
                  </TableCell>
                  <TableCell>
                    {/* {format(new Date(itmDiscounts.find(q => q.ruleCode == 'INTRODUCCION')?.startDate ?? new Date()), 'dd/MM/yyyy')} */}
                    <Box sx={{ ml: 1 }}>
                        <DatePicker
                          label=""
                          inputFormat="dd/MM/yyyy"
                          value={deisdate}
                          onChange={handleDEIsfecha}
                          renderInput={(inputProps) => <TextField {...inputProps} />}
                        />
                   </Box>
                  </TableCell>
                  <TableCell>
                    {/* {format(new Date(itmDiscounts.find(q => q.ruleCode == 'INTRODUCCION')?.endDate ?? new Date()), 'dd/MM/yyyy')} */}
                    <Box sx={{ ml: 1 }}>
                        <DatePicker
                          label=""
                          inputFormat="dd/MM/yyyy"
                          value={deiedate}
                          onChange={handleDEIefecha}
                          renderInput={(inputProps) => <TextField {...inputProps} />}
                        />
                   </Box>
                  </TableCell>
                </>
              }
            </TableRow>


            <TableRow>
              {itmDiscounts && itmDiscounts.find(q => q.ruleCode == 'CONFIDENCIAL') &&
                <>
                  <TableCell>
                    DESCUENTO PROMOCIONAL (%)
                  </TableCell>
                  <TableCell>
                    <TextField type={'number'} disabled={user.UserType!="3"}
                      value={confidencial}
                      onChange={handleConfidencialDiscountChange}
                    />
                  </TableCell>
                  <TableCell>
                    {/* {format(new Date(itmDiscounts.find(q => q.ruleCode == 'CONFIDENCIAL')?.startDate ?? new Date()), 'dd/MM/yyyy')} */}
                    <Box sx={{ ml: 1 }}>
                        <DatePicker
                          label=""
                          inputFormat="dd/MM/yyyy"
                          value={dcsdate}
                          onChange={handleDCsfecha}
                          renderInput={(inputProps) => <TextField {...inputProps} />}
                        />
                   </Box>
                  </TableCell>
                  <TableCell>
                    {/* {format(new Date(itmDiscounts.find(q => q.ruleCode == 'CONFIDENCIAL')?.endDate ?? new Date()), 'dd/MM/yyyy')} */}
                    <Box sx={{ ml: 1 }}>
                        <DatePicker
                          label=""
                          inputFormat="dd/MM/yyyy"
                          value={dcedate}
                          onChange={handleDCefecha}
                          renderInput={(inputProps) => <TextField {...inputProps} />}
                        />
                   </Box>
                  </TableCell>
                </>
              }
            </TableRow>
            <TableRow>
              {itmDiscounts && itmDiscounts.find(q => q.ruleCode == 'FIJO') &&
                <>
                  <TableCell>
                    IEBLE (%)
                  </TableCell>
                  <TableCell>
                    <TextField type={'number'} disabled={user.UserType!="3"}
                      value={fijo}
                      onChange={handleFijoDiscountChange}
                    />
                  </TableCell>
                  <TableCell>
                    {/* {format(new Date(itmDiscounts.find(q => q.ruleCode == 'FIJO')?.startDate ?? new Date()), 'dd/MM/yyyy')} */}
                    <Box sx={{ ml: 1 }}>
                        <DatePicker
                          label=""
                          inputFormat="dd/MM/yyyy"
                          value={dfisdate}
                          onChange={handleDFIsfecha}
                          renderInput={(inputProps) => <TextField {...inputProps} />}
                        />
                   </Box>
                  </TableCell>
                  <TableCell>
                    {/* {format(new Date(itmDiscounts.find(q => q.ruleCode == 'FIJO')?.endDate ?? new Date()), 'dd/MM/yyyy')} */}
                    <Box sx={{ ml: 1 }}>
                        <DatePicker
                          label=""
                          inputFormat="dd/MM/yyyy"
                          value={dfiedate}
                          onChange={handleDFIefecha}
                          renderInput={(inputProps) => <TextField {...inputProps} />}
                        />
                   </Box>
                  </TableCell>
                </>
              }
            </TableRow>




            
  
            <TableRow>
              {itmDiscounts && itmDiscounts.find(q => q.ruleCode == 'IMPUESTO') &&
                <>
                  <TableCell>
                    {itmDiscounts.find(q => q.ruleCode == 'IMPUESTO')?.ruleCode} %
                  </TableCell>
                
                  <TableCell>
                    <TextField type={'number'} disabled={user.UserType!="3"}
                      value={tax}
                      onChange={handleTAXChange}
                    />

                  </TableCell>
                  <TableCell>
                    {/* {format(new Date(itmDiscounts.find(q => q.ruleCode == 'IMPUESTO')?.startDate ?? new Date()), 'dd/MM/yyyy')} */}
                    <Box sx={{ ml: 1 }}>
                        <DatePicker
                          label=""
                          inputFormat="dd/MM/yyyy"
                          value={taxsdate}
                          onChange={handleTAXsfecha}
                          renderInput={(inputProps) => <TextField {...inputProps} />}
                        />
                   </Box>
                  </TableCell>
                  <TableCell>
                    {/* {format(new Date(itmDiscounts.find(q => q.ruleCode == 'IMPUESTO')?.endDate ?? new Date()), 'dd/MM/yyyy')} */}
                    <Box sx={{ ml: 1 }}>
                        <DatePicker
                          label=""
                          inputFormat="dd/MM/yyyy"
                          value={taxedate}
                          onChange={handleTAXefecha}
                          renderInput={(inputProps) => <TextField {...inputProps} />}
                        />
                   </Box>
                  </TableCell>
                </>
              }
            </TableRow>

          </TableBody>
        </table>
      </Grid>
      </Grid>
      </Grid>
      <Divider />






{/* // hasta aqui nuevo codigo de precios  e inicio de fotos */}

                            
                          </CardContent>

                          <Divider />     
   
                          

                          <Grid
                            container
                            spacing={3}
                          >
                            {posts.filter(q=>q.cover!='/static/mock-images/covers/caja.png' ).map((post) => (
                              
                          

                              <Grid
                                item
                                key={post.id} 
                                md={4}
                                xs={12}
                              >
                                <Card
                                  sx={{
                                    height: '100%',
                                    p: 2
                                  }}
                                >
                                  <BlogPostCardMediaWrapper>
                                    <CardMedia
                                      image={post.cover}
                                      
                                      sx={{
                                        height: '80%',
                                        position: 'absolute',
                                        top: 0,
                                        width: '80%'
                                      }}
                                    />
                                  </BlogPostCardMediaWrapper>
                                  <Box sx={{ mt: 2 }}>
                                    <div>
                                      <Chip
                                        avatar={<Avatar>{post.category}</Avatar>} 
                                        color="primary"
                                        label={post.title}
                                        size="medium"
                                       
                                      />
                                    </div>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        my: 2
                                      }}
                                    >
                                  
                                    
                                    </Box>
                                  
                                
                                  </Box>
                                  <Box>
                                
                                
                                  </Box>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                      
                      
                                                    {/* fin fotos */}
                          <Divider />     
                          <Box
                            sx={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              px: 2,
                              py: 1
                            }}
                          >
                            <Button
                              onClick={handleUpdateProduct}
                              sx={{ m: 1 }}
                              type="submit"
                              variant="contained"
                            >
                              {cambioPrecios ? 'Cambiar Precio' : 'Actualizar Inf. Proveedor'}
                            </Button>
                            <Button
                              onClick={handleCancelEdit}
                              sx={{ m: 1 }}
                              variant="outlined"
                            >
                              Cancelar
                            </Button>
                          </Box>
                          <Divider />
                        </Fragment>}
                        {user.UserType == "5" && <Fragment>
                          <CardContent>
                            <Grid
                              container
                              spacing={2}>
                              
                              <Grid
                                item
                                md={11}
                                xs={12}>
                                <Typography variant="h6">
                                  Datos código
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Grid
                                  container
                                  spacing={3}>
                                  <Grid
                                    item
                                    md={4}
                                    xs={12}
                                  >
                                    <TextField
                                      fullWidth
                                      value={itemFileCod}
                                      onChange={handleitemFileCod}
                                      label="Código"
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  px: 2,
                                  py: 1
                                }}
                              >
                                <Button
                                  onClick={handleUpdateITM}
                                  sx={{ m: 1 }}
                                  type="submit"
                                  variant="contained"
                                >
                                  Actualizar Código
                                </Button>
                                <Button color = 'success'  startIcon={<ExcelIcon />}
                                  onClick={handleGeneraExcel}
                                  sx={{ m: 1 }}
                                  type="submit"
                                  variant="contained"
                                >
                                  Exportar Excel
                                </Button>
                                <Button color = 'error'
                                  onClick={handleCancelEdit}
                                  sx={{ m: 1 }}
                                  variant="outlined"
                                >
                                  Cancelar
                                </Button>

                                <>
                                  
                                  <Button
                                    onClick={handleOpen}
                                    sx={{ m: 1 }}
                                    type="submit"
                                    variant="contained"
                                  >
                                    
                                    Regresar producto al proceso...
                                  </Button>
                                  </>

                                  <Modal
                                    open={openMod}
                                    onClose={handleClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                  >
                                    <Box
                                       sx={{
                                      position: 'absolute' as 'absolute',
                                      top: '30%',
                                      left: '30%',
                                    }}
                                    >
                      {/* <Container maxWidth="sm"> */}
                        <Paper elevation={12}>
                          <Box
                            sx={{
                              display: 'flex',
                              pb: 4,
                              pt: 3,
                              px: 3,
                              minHeight: 150,
                            }}
                          >
                            <Avatar
                              sx={{
                                backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
                                color: 'error.main',
                                mr: 2
                              }}
                            >
                              <WarningIcon fontSize="small" />
                            </Avatar>
                            <div>
                              <Typography variant="h5">
                                Devolver Estado del producto
                              </Typography>
                              <Typography
                                color="textSecondary"
                                sx={{ mt: 1 }}
                                variant="body2"
                              >
                                Esta opcion permita devolver el proceso de este producto al proveedor o asistente.
                              </Typography>
                            </div>
                          </Box>
                          <Grid
                                    item
                                    md={6}
                                    xs={12}
                                  >
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label">Motivos Retorno Producto</InputLabel>
                                      <Select
                                        id="demo-simple-select-label"
                                        value={motivosRetorno?.toString()}
                                        disabled={!(user.UserType=="1" || user.UserType=="5")}
                                        onChange={handleChangeMotivosRetornoItem}
                                        input={<OutlinedInput label="Motivos retorno producto" />}
                                        MenuProps={MenuProps}
                                      >
                                        {MotivosRetornoItem && MotivosRetornoItem.sort((a,b)=> a.dsRetorno.localeCompare(b.dsRetorno)).map((name) => (
                                          <MenuItem key={name.dsRetorno} value={name.dsRetorno}>
                                            {name.dsRetorno}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </Grid>

                                  <Grid
                                    item
                                    md={6}
                                    xs={12}
                                  >
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label">Devolver a?</InputLabel>
                                      <Select
                                        id="demo-simple-select-label"
                                        value={devolverA?.toString()}
                                        disabled={!(user.UserType=="1" || user.UserType=="5")}
                                        onChange={handleChangeDevolverA}
                                        input={<OutlinedInput label="Devolver a?" />}
                                        MenuProps={MenuProps}
                                      >
                                        {DevolverA && DevolverA.sort((a,b)=> a.dsDevolverA.localeCompare(b.dsDevolverA)).map((name) => (
                                          <MenuItem key={name.dsDevolverA} value={name.idDevolverA}>
                                            {name.dsDevolverA}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </Grid>

                                 <Box
                                   sx={{
                                   display: 'flex',
                                   justifyContent: 'flex-end',
                                     px: 3,
                                     py: 1.5
                                     }}
                                    >
                                  <Button
                                    onClick={handleClose}
                                    sx={{ mr: 2 }}
                                    variant="outlined"
                                  >
                                    Cancelar
                                  </Button>
                                  <Button
                                      color='info'     
                                      disabled = {!motivosRetorno || !devolverA }
                                      onClick={handleExecRetorno}
                                        sx={{
                                          backgroundColor: 'error.main',
                                          '&:hover': {
                                            backgroundColor: 'error.dark'
                                          }
                                        }}
                                        variant="contained"
                                      >
                                        Regresar Producto
                                      </Button>
                                    </Box>
                                  </Paper>
                                {/* </Container> */}
                              </Box>
                             </Modal>
                                  
  

                              </Box>
                            </Grid>
                          </CardContent>
                        </Fragment>}
                        {((product.RetornoProceso.trim() == '' || product.RetornoProceso == user.UserType) && (user.UserType == "2" || user.UserType == "1" || user.UserType == "4" || user.UserType == "5")) && <Fragment>
                          <Divider />
                          {(   user.UserType == "2" || user.UserType == "1" || user.UserType == "4" || user.UserType == "5") && <>  <CardContent>

                            
                            <Grid
                              container
                              spacing={2}
                            >
                              <Grid
                                item
                                md={11}
                                xs={12}
                              >
                              
                                <SeverityPill color='info'>
                                <Typography variant="h6">
                                  DATOS DE USO COMERCIAL
                                  </Typography>
                                  </SeverityPill>

                              
                               
                                <Divider sx={{ my: 2 }} />

                                
                                <Grid
                                  container
                                  spacing={3}>

                                  {((product.CambioPrecio != true) && <>



                      {/*               <Grid
                                    item
                                    md={4}
                                    xs={12}
                                  >
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label">Categoria</InputLabel>
                                      <Select
                                        id="demo-simple-select-label"
                                        value={categoryIdSelected?.toString()}
                                        onChange={handleChange}
                                        input={<OutlinedInput label="Categoria" />}
                                        MenuProps={MenuProps}
                                      >
                                        {categories && categories.sort((a,b)=> a.categoria_dsc.localeCompare(b.categoria_dsc)).map((name) => (
                                          <MenuItem key={name.categoria_id} value={name.categoria_id}>
                                            {name.categoria_dsc}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </Grid>

                                  */}
                                  <Grid
                                    item
                                    md={3}
                                    xs={12}
                                  >
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label">Subcategoria</InputLabel>
                                      <Select
                                        id="demo-simple-select-label"
                                        disabled={user.UserType!="2"}
                                        value={subCategoryIdSelected?.toString()}
                                        onChange={handleSubcategoryChange}
                                        input={<OutlinedInput label="Subcategoria" />}
                                        MenuProps={MenuProps}
                                      >
                                        {subCategories && subCategories.map((name) => (
                                          <MenuItem key={name.subcategoria_id} value={name.subcategoria_id}>
                                            {name.subcategoria_dsc}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </Grid>
 

                                    <Grid
                                    item
                                    md={3}
                                    xs={12}
                                  >
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label">Tipo de Registro</InputLabel>
                                      <Select
                                        id="demo-simple-select-label"
                                        disabled={user.UserType!="2"}
                                        value={tipoRegistroIdSelected?.toString()}
                                        onChange={handleTipoRegistroChange}
                                        input={<OutlinedInput label="Tipo Registro" />}
                                        MenuProps={MenuProps}
                                      >
                                        {tiposregistro && tiposregistro.map((name) => (
                                          <MenuItem key={name.TipoRegistro_ID} value={name.TipoRegistro_ID}>
                                            {name.DescripcionTR}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  <Grid
                                    item
                                    md={3}
                                    xs={12}
                                  >
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label">Metodo de compra</InputLabel>
                                      <Select
                                        id="demo-simple-select-label"
                                        disabled={user.UserType!="2"}
                                        value={buyerTypeSelected?.toString()}
                                        onChange={handleBuyerTypeChange}
                                        input={<OutlinedInput label="Metodo de compra" />}
                                        MenuProps={MenuProps}
                                      >
                                        {buyerTypes && buyerTypes.map((name) => (
                                          <MenuItem key={name.tipoCompra_id} value={name.tipoCompra_id}>
                                            {name.tipoCompra_dsc}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </Grid>

                                  <Grid
                                    item
                                    md={3}
                                    xs={12}
                                  >
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 3
                                      }}
                                    >
                                      <div>
                                        <Typography variant="subtitle1">
                                          Compra por Caja
                                        </Typography>
                                      </div>
                                      <Switch checked={checked}
                                       disabled={user.UserType!="2"}
                                        onChange={handleCheckedChange} />
                                    </Box>
                                  </Grid>

                          
                                  <Grid
                                    item
                                    md={6}
                                    xs={12}
                                  >
                                    <TextField
                                     disabled={user.UserType!="2"}
                                      fullWidth 
                                      value={comercialLongDescription}
                                      onChange={handleComercialLongDescriptionChange}
                                      label="Descripción Larga (maximo 40 caracteres)"
                                      inputProps={{ maxLength: 40 }}
                                      
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    md={6}
                                    xs={12}
                                  >
                                    <TextField    
                                      fullWidth  disabled={user.UserType!="2"}
                                      value={comercialShortDescription}
                                      onChange={handleComercialShortDescriptionChange}
                                      label="Descripción Corta (maximo 12 caracteres)"
                                      inputProps={{ maxLength: 12 }}   
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    md={12}
                                    xs={12}
                                  >
                                    <TextField    
                                      fullWidth  disabled={user.UserType!="2"}
                                      value={comercialPubliDescription}
                                      onChange={handleComercialPubliDescriptionChange}
                                      label="Descripción de Publicacion (maximo 60 caracteres)"
                                      inputProps={{ maxLength: 60 }}
                                    />
                                  </Grid>  

                                  <Grid
                                    item
                                    md={12}
                                    xs={12}
                                  >
                                    <TextField    
                                      fullWidth  disabled={user.UserType!="2"}
                                      value={comercialFonetDescription}
                                      onChange={handleComercialFonetDescriptionChange}
                                      label="Descripción Fonetica (maximo 60 caracteres)"
                                      inputProps={{ maxLength: 60 }}
                                    />
                                  </Grid>  

                                  <Grid
                                    item
                                    md={12}
                                    xs={12}
                                  >
                                    <TextField    
                                      fullWidth  disabled={user.UserType!="2"}
                                      value={comercialHablaDescription}
                                      onChange={handleComercialHablaDescriptionChange}
                                      label="Descripción Hablador (maximo 35 caracteres)"
                                      inputProps={{ maxLength: 35 }}
                                    />
                                  </Grid>  

                                  <Grid
                                    item
                                    md={6}
                                    xs={12}
                                  >
                                    <TextField    
                                      fullWidth  disabled={user.UserType!="2"}
                                      value={UbicacionCedi}
                                      onChange={handleUbicacionCEDIChange}
                                      label="Ubicación CEDI"
                                      inputProps={{ maxLength: 35 }}
                                    />
                                  </Grid>  
                                  

                                  <Grid
                                    item
                                    md={6}
                                    xs={12}
                                  >
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label">Segmentacion Articulo</InputLabel>
                                      <Select
                                        id="demo-simple-select-label"
                                        value={IdSegmentacionSelected?.toString()}
                                        disabled={user.UserType!="2"}
                                        onChange={handleChangeSegmentacion}
                                        input={<OutlinedInput label="Segmentacion Articulo" />}
                                        MenuProps={MenuProps}
                                      >
                                        {ASegmentacionArticulo && ASegmentacionArticulo.sort((a,b)=> a.dsSegmentacion.localeCompare(b.dsSegmentacion)).map((name) => (
                                          <MenuItem key={name.dsSegmentacion} value={name.idSegmentacion}>
                                            {name.dsSegmentacion}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </Grid>

                                  <Grid
                                    item
                                    md={6}
                                    xs={12}
                                  >
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label">Area de Manejo</InputLabel>
                                      <Select
                                        id="demo-simple-select-label"
                                        value={IdAreaManejoSelected?.toString()}
                                        disabled={user.UserType!="2" || buyerTypeSelected !=2 }
                                        onChange={handleChangeAreaManejo}
                                        input={<OutlinedInput label="Area de Manejo" />}
                                        MenuProps={MenuProps}
                                      >
                                        {AareaManejo && AareaManejo.sort((a,b)=> a.dsAreaManejo.localeCompare(b.dsAreaManejo)).map((name) => (
                                          <MenuItem key={name.dsAreaManejo} value={name.idAreaManejo}>
                                            {name.dsAreaManejo}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </Grid>



                                  <Grid mt={1}
                                  container
                                  spacing={3}
                                >
                                 
                                </Grid>


                                <Grid
                                    item
                                    md={6}
                                    xs={12}
                                  >
                                    <TextField    
                                      fullWidth disabled={user.UserType !== "1"}
                                      value={ProyMenVtasUni}
                                      onChange={handleProyMenVtasUniChange}
                                      label="Proyeccion Mensual Ventas Unidad"
                                      type={'number'}
                                    />
                                  </Grid>

                                  <Grid
                                    item
                                    md={6}
                                    xs={12}
                                  >
                                    <TextField    
                                      fullWidth disabled={user.UserType !== "1"}
                                      value={ProyMenVtasCol}
                                      onChange={handleProyMenVtasColChange}
                                      label="Proyeccion Mensual Ventas Colones"
                                     type={'number'}
                                    />
                                  </Grid>
                                  
                                  
                                  </>  )}
                                  
                                  {(user.UserType == "1" || user.UserType == "4" || user.UserType == "5") && <Fragment>

                                    <Grid
                                      item
                                      md={3}
                                      xs={12}
                                    >
                                      <Typography variant="h6">
                                        Peri
                                      </Typography>
                                      <Divider sx={{ my: 2 }} />
                                      <Grid
                                        container
                                        spacing={3}>
                                       {/*  <Grid
                                          item
                                          md={6}
                                          xs={12}
                                        >
                                          <TextField type={'number'} disabled={user.UserType == "4" ||  user.UserType == "5"} value={periCostUtility} onChange={handlePeriCostUtilityChange}
                                            fullWidth defaultValue={0}
                                            label="Utilidad Costo %"
                                          />
                                        </Grid> */}
                                        <Grid
                                          item
                                          md={6}
                                          xs={12}
                                        >
                                          <TextField type={'number'} value={periCostSale} disabled={user.UserType == "4"||  user.UserType == "5"} onChange={handlePeriCostSaleChange}
                                            fullWidth defaultValue={0}
                                            label="Utilidad Venta %"
                                          />
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                    <Grid
                                      item
                                      md={3}
                                      xs={12}
                                    >
                                      <Typography variant="h6">
                                        Super Compro
                                      </Typography>
                                      <Divider sx={{ my: 2 }} />
                                      <Grid
                                        container
                                        spacing={3}>
                                       {/*  <Grid
                                          item
                                          md={6}
                                          xs={12}
                                        >
                                          <TextField defaultValue={0} disabled={user.UserType == "4" ||  user.UserType == "5"} value={supercomproCostUtility} onChange={handleSupercomproCostUtilityChange}
                                            fullWidth type={'number'}
                                            label="Utilidad Costo %"
                                          />
                                        </Grid> */}
                                        <Grid
                                          item
                                          md={6}
                                          xs={12}
                                        >
                                          <TextField
                                            fullWidth type={'number'} defaultValue={0} disabled={user.UserType == "4" ||  user.UserType == "5"} value={supercomproCostSale} onChange={handleSupercomproCostSaleChange}
                                            label="Utilidad Venta %"
                                          />
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                    <Grid
                                      item
                                      md={3}
                                      xs={12}
                                    >
                                      <Typography variant="h6">
                                        Saretto
                                      </Typography>
                                      <Divider sx={{ my: 2 }} />
                                      <Grid
                                        container
                                        spacing={3}>
                                       {/*  <Grid
                                          item
                                          md={6}
                                          xs={12}
                                        >
                                          <TextField
                                            fullWidth type={'number'} defaultValue={0} disabled={user.UserType == "4" ||  user.UserType == "5"} value={sarettoCostUtility} onChange={handleSarettoCostUtilityChange}
                                            label="Utilidad Costo %"
                                          />
                                        </Grid> */}
                                        <Grid
                                          item
                                          md={6}
                                          xs={12}
                                        >
                                          <TextField
                                            fullWidth type={'number'} disabled={user.UserType == "4" ||  user.UserType == "5"} defaultValue={0} value={sarettoCostSale} onChange={handleSarettoCostSaleChange}
                                            label="Utilidad Venta %"
                                          />
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                    <Grid
                                      item
                                      md={3}
                                      xs={12}
                                    >
                                      <Typography variant="h6">
                                        Super Víquez
                                      </Typography>
                                      <Divider sx={{ my: 2 }} />
                                      <Grid
                                        container
                                        spacing={3}>
                                       {/*  <Grid
                                          item
                                          md={6}
                                          xs={12}
                                        >
                                          <TextField type={'number'} disabled={user.UserType == "4" ||  user.UserType == "5"} value={superviquezCostUtility} onChange={handlesuperviquezCostUtilityChange}
                                            fullWidth defaultValue={0}
                                            label="Utilidad Costo %"
                                          />
                                        </Grid> */}
                                        <Grid
                                          item
                                          md={6}
                                          xs={12}
                                        >
                                          <TextField type={'number'} disabled={user.UserType == "4"||  user.UserType == "5"}  value={superviquezCostSale} onChange={handleSuperviqueaCostSaleChange}
                                            fullWidth defaultValue={0}
                                            label="Utilidad Venta %"
                                          />
                                        </Grid>
                                      </Grid>
                                    </Grid>

                                    <Divider sx={{ my: 3 }} />
                                    {(user.UserType == '4' || user.UserType == '1' ||  user.UserType == "5") &&
                                      <Grid
                                        item
                                        md={12}
                                        xs={12}
                                      >
                                         <SeverityPill color='info'>
                                        <Typography variant="h6">
                                          INFORMACION COMERCIAL
                                        </Typography>
                                        </SeverityPill>
                                        <Divider sx={{ my: 2 }} />
                                        <Grid
                                          container
                                          spacing={1}
                                        >
                                          <Grid item md={6} xs={12}>
                                            <table >
                                              <TableHead>
                                                <TableRow>
                                                  
                                                <TableCell><Typography variant="subtitle1"> DESCRIPCION</Typography></TableCell> 
                                                <TableCell><Typography variant="subtitle1"> MONTO %</Typography></TableCell> 
                                                <TableCell><Typography variant="subtitle1"> DESDE</Typography></TableCell> 
                                                <TableCell><Typography variant="subtitle1"> HASTA</Typography></TableCell> 
                                                  
                                                
                                                </TableRow>

                                              </TableHead>
                                              <TableBody>
                                                <TableRow>
                                                  <TableCell>
                                                    COSTO ¢
                                                  </TableCell>
                                                  <TableCell>
                                                  <TextField type={'number'} disabled={true}
                                                          value={product.amount?.toFixed(2)}
                                                         
                                                        />
                                                    {}
                                                  </TableCell>
                                                  <TableCell>-</TableCell>
                                                  <TableCell>-</TableCell>
                                                </TableRow>
                                                <TableRow>
                                            <TableCell>
                                              DESCUENTO FIJO PROV.
                                            </TableCell>
                                            <TableCell>
                                              {/* {product.amount?.toFixed(2)} */}
                                              <TextField type={'number'} disabled={true}
                                                    value={descuentoFijo}
                                                    
                                                  />
                                            </TableCell>
                                            <TableCell>-</TableCell>
                                            <TableCell>-</TableCell>
                                          </TableRow>
                                          
         
                                                <TableRow>
                                                  {itmDiscounts && itmDiscounts.find(q => q.ruleCode == 'INTRODUCCION') &&
                                                    <>
                                                      <TableCell>
                                                        {itmDiscounts.find(q => q.ruleCode == 'INTRODUCCION')?.ruleCode}
                                                      </TableCell>
                                                      <TableCell>
                                                        <TextField type={'number'} disabled={user.UserType!="3"}
                                                          value={introduccion}
                                                          onChange={handleIntroduccionDiscountChange}
                                                        />
                                                      </TableCell>
                                                     {/*  <TableCell>
                                                        {format(new Date(itmDiscounts.find(q => q.ruleCode == 'INTRODUCCION')?.startDate ?? new Date()), 'dd/MM/yyyy')}
                                                      </TableCell>
                                                      <TableCell>
                                                        {format(new Date(itmDiscounts.find(q => q.ruleCode == 'INTRODUCCION')?.endDate ?? new Date()), 'dd/MM/yyyy')}
                                                      </TableCell> */}
                                                        <TableCell>
                                                        {/* {format(new Date(itmDiscounts.find(q => q.ruleCode == 'INTRODUCCION')?.startDate ?? new Date()), 'dd/MM/yyyy')} */}
                                                        <Box sx={{ ml: 1 }}>
                                                            <DatePicker
                                                              label=""
                                                              inputFormat="dd/MM/yyyy"
                                                              value={deisdate}
                                                              onChange={handleDEIsfecha}
                                                              renderInput={(inputProps) => <TextField {...inputProps} />}
                                                            />
                                                      </Box>
                                                      </TableCell>
                                                      <TableCell>
                                                        {/* {format(new Date(itmDiscounts.find(q => q.ruleCode == 'INTRODUCCION')?.endDate ?? new Date()), 'dd/MM/yyyy')} */}
                                                        <Box sx={{ ml: 1 }}>
                                                            <DatePicker
                                                              label=""
                                                              inputFormat="dd/MM/yyyy"
                                                              value={deiedate}
                                                              onChange={handleDEIefecha}
                                                              renderInput={(inputProps) => <TextField {...inputProps} />}
                                                            />
                                                      </Box>
                                                      </TableCell>
                                                    </>
                                                  }
                                                </TableRow>


                                                <TableRow>
              {itmDiscounts && itmDiscounts.find(q => q.ruleCode == 'CONFIDENCIAL') &&
                <>
                  <TableCell>
                    DESCUENTO PROMOCIONAL (%)
                  </TableCell>
                  <TableCell>
                    <TextField type={'number'} disabled={user.UserType!="1"}
                      value={confidencial}
                      onChange={handleConfidencialDiscountChange}
                    />
                  </TableCell>

                {/*   <TableCell>
                   {format(new Date(itmDiscounts.find(q => q.ruleCode == 'CONFIDENCIAL')?.startDate ?? new Date()), 'dd/MM/yyyy')}
                   </TableCell>
                   <TableCell>
                   {format(new Date(itmDiscounts.find(q => q.ruleCode == 'CONFIDENCIAL')?.endDate ?? new Date()), 'dd/MM/yyyy')}
                    </TableCell> */}

                  <TableCell>
                    {/* {format(new Date(itmDiscounts.find(q => q.ruleCode == 'CONFIDENCIAL')?.startDate ?? new Date()), 'dd/MM/yyyy')} */}
                    <Box sx={{ ml: 1 }}>
                        <DatePicker
                          label=""
                          inputFormat="dd/MM/yyyy"
                          value={dcsdate}
                          onChange={handleDCsfecha}
                          renderInput={(inputProps) => <TextField {...inputProps} />}
                        />
                   </Box>
                  </TableCell>
                  <TableCell>
                    {/* {format(new Date(itmDiscounts.find(q => q.ruleCode == 'CONFIDENCIAL')?.endDate ?? new Date()), 'dd/MM/yyyy')} */}
                    <Box sx={{ ml: 1 }}>
                        <DatePicker
                          label=""
                          inputFormat="dd/MM/yyyy"
                          value={dcedate}
                          onChange={handleDCefecha}
                          renderInput={(inputProps) => <TextField {...inputProps} />}
                        />
                   </Box>
                  </TableCell>
             
                </>
              }
            </TableRow>
            <TableRow>
              {itmDiscounts && itmDiscounts.find(q => q.ruleCode == 'FIJO') &&
                <>
                  <TableCell>
                    IEBLE (%)
                  </TableCell>
                  <TableCell>
                    <TextField type={'number'} disabled={user.UserType!="3"}
                      value={fijo}
                      onChange={handleFijoDiscountChange}
                    />
                  </TableCell>

                  <TableCell>
                  {/*  {format(new Date(itmDiscounts.find(q => q.ruleCode == 'FIJO')?.startDate ?? new Date()), 'dd/MM/yyyy')} */}
                  <Box sx={{ ml: 1 }}>
                        <DatePicker
                          label=""
                          inputFormat="dd/MM/yyyy"
                          value={dfisdate}
                          onChange={handleDFIsfecha}
                          renderInput={(inputProps) => <TextField {...inputProps} />}
                        />
                   </Box>
                   </TableCell>
                   <TableCell>
                   {format(new Date(itmDiscounts.find(q => q.ruleCode == 'FIJO')?.endDate ?? new Date()), 'dd/MM/yyyy')}
                    </TableCell>
                  
       
                </>
              }
            </TableRow>





          
                                                <TableRow>
                                                  {itmDiscounts && itmDiscounts.find(q => q.ruleCode == 'IMPUESTO') &&
                                                    <>
                                                      <TableCell>
                                                        {itmDiscounts.find(q => q.ruleCode == 'IMPUESTO')?.ruleCode} %
                                                      </TableCell>
                                                      <TableCell>
                                                        {itmDiscounts.find(q => q.ruleCode == 'IMPUESTO')?.value}
                                                      </TableCell>
                                                      <TableCell>
                                                        {format(new Date(itmDiscounts.find(q => q.ruleCode == 'IMPUESTO')?.startDate ?? new Date()), 'dd/MM/yyyy')}
                                                       {/* <Box sx={{ ml: 1 }}>
                                                            <DatePicker
                                                              label=""
                                                              inputFormat="dd/MM/yyyy"
                                                              value={taxsdate}
                                                              onChange={handleTAXsfecha}
                                                              renderInput={(inputProps) => <TextField {...inputProps} />}
                                                            />
                                                      </Box> */}
                                                      </TableCell>
                                                      <TableCell>
                                                        {format(new Date(itmDiscounts.find(q => q.ruleCode == 'IMPUESTO')?.endDate ?? new Date()), 'dd/MM/yyyy')}
                                                      </TableCell>
                                                    </>
                                                  }
                                                </TableRow>

                                              </TableBody>
                                            </table>
                                          </Grid>
                                          <Grid item md={6} xs={12}>
                                            <Table>
                                              <TableHead>
                                                <TableRow>
                                                <TableCell><Typography variant="subtitle1">Costo Neto ¢</Typography></TableCell> 
                                                <TableCell><Typography variant="subtitle1">{grossCostAmount}</Typography> 
                                            
                                                </TableCell> 
                                                <TableCell><Typography variant="subtitle1"> Nuevo Precio ¢</Typography></TableCell> 
                                                
                                                  
                                                  
                                            
                                                </TableRow>
                                              </TableHead>
                                              <TableBody>
                                                <TableRow>
                                                  <TableCell>
                                                  <TextField size="medium"
                                                      fullWidth={false}
                                                      value={periSinIVA} disabled
                                                      type={'number'}
                                                      label="PERI SIN IVA"
                                                    />
                                                  
                                                  </TableCell>

                                                  <TableCell>
                                                  <TextField size="medium"
                                                      fullWidth={false}
                                                      value={periConIVA} disabled
                                                      type={'number'}
                                                      label="PERI CON IVA"
                                                    />
                                                  
                                                
                                                  </TableCell>
                                                    
                                                  
                                                  <TableCell>
                                                    <TextField size="medium"
                                                      fullWidth={false}
                                                      value={periPrice} disabled={user.UserType == "5" || user.UserType == "4"  }
                                                      type={'number'}
                                                      onChange={handlePeriPriceChange}
                                                      label="Precio Peri"
                                                    />
                                                  </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                <TableCell>
                                                  <TextField size="medium"
                                                      fullWidth={false}
                                                      value={supercomproSinIVA} disabled
                                                      type={'number'}
                                                      label="SUPER COMPRO SIN IVA"
                                                    />
                                                  
                                                  </TableCell>

                                                  <TableCell>
                                                  <TextField size="medium"
                                                      fullWidth={false}
                                                      value={supercomproConIVA} disabled
                                                      type={'number'}
                                                      label="SUPER COMPRO CON IVA"
                                                    />
                                                  
                                                
                                                  </TableCell>
                                                 
                                                  <TableCell>
                                                    <TextField
                                                      fullWidth
                                                      value={superPrice} disabled={user.UserType == "5"  || user.UserType == "4" }
                                                      type={'number'}
                                                      onChange={handleSuperPriceChange}
                                                      label="Precio Supercompro"
                                                    />
                                                  </TableCell>
                                                </TableRow>
                                                <TableRow>

                                                <TableCell>
                                                  <TextField size="medium"
                                                      fullWidth={false}
                                                      value={sarettoSinIVA} disabled
                                                      type={'number'}
                                                      label="SARETTO SIN IVA"
                                                    />
                                                  
                                                  </TableCell>

                                                  <TableCell>
                                                  <TextField size="medium"
                                                      fullWidth={false}
                                                      value={sarettoConIVA} disabled
                                                      type={'number'}
                                                      label="SARETTO CON IVA"
                                                    />
                                                  
                                                
                                                  </TableCell>
                                                
                                                
                                                  <TableCell>
                                                    <TextField
                                                      fullWidth
                                                      value={sarettoPrice} disabled={user.UserType == "5"  || user.UserType == "4" }
                                                      type={'number'}
                                                      onChange={handleSarettoPriceChange}
                                                      label="Precio Saretto"
                                                    />
                                                  </TableCell>
                                                </TableRow>

                                                <TableRow>

                                                <TableCell>
                                                  <TextField size="medium"
                                                      fullWidth={false}
                                                      value={superviquezSinIVA} disabled
                                                      type={'number'}
                                                      label="SUPER VIQUEZ SIN IVA"
                                                    />
                                                  
                                                  </TableCell>

                                                  <TableCell>
                                                  <TextField size="medium"
                                                      fullWidth={false}
                                                      value={superviquezConIVA} disabled
                                                      type={'number'}
                                                      label="SUPER VIQUEZ CON IVA"
                                                    />
                                                  
                                                
                                                  </TableCell>
                                                
                                                 
                                                  <TableCell>
                                                    <TextField size="medium"
                                                      fullWidth={false}
                                                      value={superviquezPrice} disabled={user.UserType == "5"  || user.UserType == "4" }
                                                      type={'number'}
                                                      onChange={handleSuperViquezPriceChange}
                                                      label="Precio Super Viquez"
                                                    />
                                                  </TableCell>
                                                </TableRow>

                                              </TableBody>
                                            </Table>
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                    }

                              {((product.CambioPrecio != true) && <>

                                <Grid
                                      item
                                      md={12}
                                      xs={12}>
                                          <SeverityPill color='info'>
                                        <Typography variant="h6">
                                          CADENAS
                                        </Typography>
                                        </SeverityPill>
                                        <Divider sx={{ my: 2 }} />
                                        </Grid>
                                    <Grid
                                      item
                                      md={6}
                                      xs={12}>
                                         
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          justifyContent: 'flex-start',
                                          mb: 3
                                        }}
                                      >
                                        <div>
                                          <Typography variant="subtitle1">
                                            CADENA PERIMERCADOS
                                          </Typography>
                                        </div>
                                        <Switch checked={perichecked} color="warning" disabled={user.UserType == "4"} onChange={handleperichecked} />
                                      </Box>
                                      <FormControl variant="standard" sx={{ m: 2, minWidth: 400, maxWidth: 400 }}>

                                        <InputLabel id="demo-multiple-checkbox-label">Cadena PERIMERCADOS</InputLabel>
                                        <Select
                                          labelId="demo-multiple-checkbox-label"
                                          id="demo-multiple-checkbox"
                                          multiple
                                          value={perimercadosSelected}
                                          onChange={handleChangePOSPerimercados}
                                          input={<OutlinedInput label="Cadena PERIMERCADOS" />}
                                          renderValue={(selected) => selected.join(', ')}
                                          MenuProps={MenuProps}
                                        >
                                          {perimercados.map((name) => (
                                            <MenuItem key={name} value={name}>
                                              <Checkbox checked={perimercadosSelected.indexOf(name) > -1} />
                                              <ListItemText primary={name} />
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </FormControl>
                                    </Grid>




                                    <Grid
                                      item
                                      md={6}
                                      xs={12}
                                    >
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          justifyContent: 'flex-start',
                                          mb: 3
                                        }}
                                      >
                                        <div>
                                          <Typography variant="subtitle1">
                                            CADENA SARETTO
                                          </Typography>
                                        </div>
                                        <Switch checked={sarettochecked} color="warning" disabled={user.UserType == "4"} onChange={handlesarettochecked} />
                                      </Box>
                                      <FormControl variant="standard" sx={{ m: 2, minWidth: 400, maxWidth: 400 }}>

                                        <InputLabel id="demo-multiple-checkbox-label">Cadena SARETTO</InputLabel>
                                        <Select
                                          labelId="demo-multiple-checkbox-label"
                                          id="demo-multiple-checkbox"
                                          multiple
                                          value={sarettoSelected}
                                          onChange={handleChangePOSSaretto}
                                          input={<OutlinedInput label="Cadena SARETTO" />}
                                          renderValue={(selected) => selected.join(', ')}
                                          MenuProps={MenuProps}
                                        >
                                          {saretto.map((name) => (
                                            <MenuItem key={name} value={name}>
                                              <Checkbox checked={sarettoSelected.indexOf(name) > -1} />
                                              <ListItemText primary={name} />
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </FormControl>
                                    </Grid>
                                    <Grid
                                      item
                                      md={6}
                                      xs={12}>
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          justifyContent: 'flex-start',
                                          mb: 3
                                        }}
                                      >
                                        <div>
                                          <Typography variant="subtitle1">
                                            CADENA SUPER COMPRO
                                          </Typography>
                                        </div>
                                        <Switch checked={supercomprochecked} color="warning" disabled={user.UserType == "4"} onChange={handlesupercomprochecked} />
                                      </Box>
                                      <FormControl variant="standard" sx={{ m: 2, minWidth: 400, maxWidth: 400 }}>

                                        <InputLabel id="demo-multiple-checkbox-label">Cadena SUPERCOMPRO</InputLabel>
                                        <Select
                                          labelId="demo-multiple-checkbox-label"
                                          id="demo-multiple-checkbox"
                                          multiple
                                          value={supercomproSelected}
                                          onChange={handleChangePOSSuperCompro}
                                          input={<OutlinedInput label="Cadena SUPERCOMPRO" />}
                                          renderValue={(selected) => selected.join(', ')}
                                          MenuProps={MenuProps}
                                        >
                                          {supercompro.map((name) => (
                                            <MenuItem key={name} value={name}>
                                              <Checkbox checked={supercomproSelected.indexOf(name) > -1} />
                                              <ListItemText primary={name} />
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </FormControl>
                                    </Grid>
                                    <Grid
                                      item
                                      md={6}
                                      xs={12}>
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          justifyContent: 'flex-start',
                                          mb: 3
                                        }}
                                      >
                                        <div>
                                          <Typography variant="subtitle1">
                                            CADENA SUPER VIQUEZ
                                          </Typography>
                                        </div>
                                        <Switch defaultChecked color="warning" checked={superviquezchecked} disabled={user.UserType == "4"} onChange={handlesuperviquezchecked} />
                                      </Box>
                                      <FormControl variant="standard" sx={{ m: 2, minWidth: 400, maxWidth: 400 }}>

                                        <InputLabel id="demo-multiple-checkbox-label">Cadena SUPER VIQUEZ</InputLabel>
                                        <Select
                                          labelId="demo-multiple-checkbox-label"
                                          id="demo-multiple-checkbox"
                                          multiple
                                          value={superviquezSelected}
                                          onChange={handleChangePOSSuperviquez}
                                          input={<OutlinedInput label="Cadena SUPER VIQUEZ" />}
                                          renderValue={(selected) => selected.join(', ')}
                                          MenuProps={MenuProps}
                                        >
                                          {superviquez.map((name) => (
                                            <MenuItem key={name} value={name}>
                                              <Checkbox checked={superviquezSelected.indexOf(name) > -1} />
                                              <ListItemText primary={name} />
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </FormControl>
                                    </Grid>       </>)}
                                    
                                    </Fragment>}
                                </Grid>
                              </Grid>
                            </Grid>

                          </CardContent>

                            {(user.UserType == "2"  || user.UserType == "1") &&    // verificar aqui  {(user.UserType == "2"  || user.UserType == "4" || user.UserType == "1") &&   
                              <>
                                <Divider />
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    px: 2,
                                    py: 1
                                  }}
                                >
                                  <Button
                                    onClick={handleUpdateComercialDataProduct}
                                    sx={{ m: 1 }}
                                    type="submit"
                                    variant="contained"
                                  >
                                     {/* <-- Actualiza el ADC datos Informacion Comercial */}
                                    Actualizar Uso Comercial
                                  </Button>

                                  <Button
                                    onClick={handleCancelEdit}
                                    sx={{ m: 1 }}
                                    variant="outlined"
                                  >
                                    Cancelar
                                  </Button>
                                
                                  {(user.UserType == "1"  || user.UserType == "5") &&    // verificar aqui  {(user.UserType == "2"  || user.UserType == "4" || user.UserType == "1") &&   
                              <>
                                  
                                  <Button
                                    onClick={handleOpen}
                                    sx={{ m: 1 }}
                                    type="submit"
                                    variant="contained"
                                  >
                                    
                                    Regresar producto al proceso...
                                  </Button>
                                  </>
                                  }
                                  <Modal
                                    open={openMod}
                                    onClose={handleClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                  >
                                    <Box
                                       sx={{
                                      position: 'absolute' as 'absolute',
                                      top: '30%',
                                      left: '30%',
                                    }}
                                    >
                      {/* <Container maxWidth="sm"> */}
                        <Paper elevation={12}>
                          <Box
                            sx={{
                              display: 'flex',
                              pb: 4,
                              pt: 3,
                              px: 3,
                              minHeight: 150,
                            }}
                          >
                            <Avatar
                              sx={{
                                backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
                                color: 'error.main',
                                mr: 2
                              }}
                            >
                              <WarningIcon fontSize="small" />
                            </Avatar>
                            <div>
                              <Typography variant="h5">
                                Devolver Estado del producto
                              </Typography>
                              <Typography
                                color="textSecondary"
                                sx={{ mt: 1 }}
                                variant="body2"
                              >
                                Esta opcion permita devolver el proceso de este producto al proveedor o asistente.
                              </Typography>
                            </div>
                          </Box>
                          <Grid
                                    item
                                    md={6}
                                    xs={12}
                                  >
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label">Motivos Retorno Producto</InputLabel>
                                      <Select
                                        id="demo-simple-select-label"
                                        value={motivosRetorno?.toString()}
                                        disabled={user.UserType!="1" }
                                        onChange={handleChangeMotivosRetornoItem}
                                        input={<OutlinedInput label="Motivos retorno producto" />}
                                        MenuProps={MenuProps}
                                      >
                                        {MotivosRetornoItem && MotivosRetornoItem.sort((a,b)=> a.dsRetorno.localeCompare(b.dsRetorno)).map((name) => (
                                          <MenuItem key={name.dsRetorno} value={name.dsRetorno}>
                                            {name.dsRetorno}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </Grid>

                                  <Grid
                                    item
                                    md={6}
                                    xs={12}
                                  >
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label">Devolver a?</InputLabel>
                                      <Select
                                        id="demo-simple-select-label"
                                        value={devolverA?.toString()}
                                        disabled={user.UserType!="1" }
                                        onChange={handleChangeDevolverA}
                                        input={<OutlinedInput label="Devolver a?" />}
                                        MenuProps={MenuProps}
                                      >
                                        {DevolverA && DevolverA.sort((a,b)=> a.dsDevolverA.localeCompare(b.dsDevolverA)).map((name) => (
                                          <MenuItem key={name.dsDevolverA} value={name.idDevolverA}>
                                            {name.dsDevolverA}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </Grid>

                                 <Box
                                   sx={{
                                   display: 'flex',
                                   justifyContent: 'flex-end',
                                     px: 3,
                                     py: 1.5
                                     }}
                                    >
                                  <Button
                                    onClick={handleClose}
                                    sx={{ mr: 2 }}
                                    variant="outlined"
                                  >
                                    Cancelar
                                  </Button>
                                  <Button
                                      color='info'     
                                      disabled = {!motivosRetorno || !devolverA }
                                      onClick={handleExecRetorno}
                                        sx={{
                                          backgroundColor: 'error.main',
                                          '&:hover': {
                                            backgroundColor: 'error.dark'
                                          }
                                        }}
                                        variant="contained"
                                      >
                                        Regresar Producto
                                      </Button>
                                    </Box>
                                  </Paper>
                                {/* </Container> */}
                              </Box>
                             </Modal>
                               </Box>
                              </>
                            }  </>}
                          <Divider />

                  
                          {(user.UserType == "1" || user.UserType == "4")
                            && <CardContent>
                              <Grid container spacing={2}>
                                <Grid item md={11} xs={12}>

                                  <Divider sx={{ my: 2 }} />
                                  <Grid container spacing={3}>
                                    <Grid item md={6} xs={12}>
                                      {
                                        (product.ComercialLongDescription && product.ComercialLongDescription.length > 0
                                          && product.ComercialPubliDescription && product.ComercialPubliDescription.length > 0
                                          && product.ComercialShortDescription && product.ComercialShortDescription.length > 0)
                                        && <Button onClick={handleAccept} sx={{ backgroundColor: 'success.main', mr: 3, '&:hover': { backgroundColor: 'success.dark' } }} variant="contained" > {user.UserType == "2" ? 'Enviar a ADC' : 'Aprobar'}
                                        </Button>
                                        // ESTE BOTON APRUEBA LA INFORMACION COMERCIAL DENTRO USUARIO ADC (userType=2) 
                                      }
                                      {
                                        (!product.ComercialPubliDescription || product.ComercialPubliDescription.length <= 0 ||!product.ComercialLongDescription || product.ComercialLongDescription.length <= 0 || !product.ComercialShortDescription || product.ComercialShortDescription.length <= 0) &&
                                        <Button disabled onClick={handleAccept} sx={{ backgroundColor: 'success.main', mr: 3, '&:hover': { backgroundColor: 'success.dark' } }} variant="contained" > {user.UserType == "2" ? 'Enviar a ADC' : ''}
                                        </Button>
                                      }
                                      {user.UserType != "2" && <Button onClick={handleReject} sx={{ backgroundColor: 'error.main', mr: 3, '&:hover': { backgroundColor: 'error.dark' } }} variant="contained" >
                                        Rechazar
                                      </Button>}
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </CardContent>
                          }
                        </Fragment>}
                        <CardContent>
                          <Grid
                            container
                            spacing={3}
                          >
                            <Grid
                              item
                              md={12}
                              xs={12}
                            >
                                <SeverityPill color='error'>
                                <Typography variant="h6">
                                  OTROS DATOS
                                  </Typography>
                                  </SeverityPill>

                                  
                               
                          
                              <Divider sx={{ my: 2 }} />


                              {(user.UserType != '3') &&
                                      <>

                          <Grid
                            container
                            spacing={3}
                          >
                            {posts.filter(q=>q.cover!='/static/mock-images/covers/caja.png' ).map((post) => (
                              
                          

                              <Grid
                                item
                                key={post.id} 
                                md={4}
                                xs={12}
                              >
                                <Card
                                  sx={{
                                    height: '100%',
                                    p: 2
                                  }}
                                >
                                  <BlogPostCardMediaWrapper>
                                    <CardMedia
                                      image={post.cover}
                                      
                                      sx={{
                                        height: '80%',
                                        position: 'absolute',
                                        top: 0,
                                        width: '80%'
                                      }}
                                    />
                                  </BlogPostCardMediaWrapper>
                                  <Box sx={{ mt: 2 }}>
                                    <div>
                                      <Chip
                                        avatar={<Avatar>{post.category}</Avatar>} 
                                        color="primary"
                                        label={post.title}
                                        size="medium"
                                       
                                      />
                                    </div>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        my: 2
                                      }}
                                    >
                                  
                                    
                                    </Box>
                                  
                                
                                  </Box>
                                  <Box>
                                
                                
                                  </Box>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                      
                      
                                                    {/* fin fotos */}




                            </>
                                    }
                              <Grid
                                container
                                spacing={2}>
                                <Grid
                                  item
                                  md={6}
                                  xs={12}>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      flexWrap: 'wrap',
                                      px: 2,
                                      py: 1
                                    }}>
                                    <PropertyListItem
                                      disableGutters
                                      label="Categoria clasificacion"
                                      value={`${product.classificationCategoryCode} - ${product.classificationCategoryDesc}`}
                                    />
                                    <PropertyListItem
                                      disableGutters
                                      label="Fecha de disponibilidad"
                                      value={`del ${product.startAvailabilityDateTime} al ${product.endAvailabilityDateTime}`}
                                    />
                                    <PropertyListItem
                                      disableGutters
                                      label="Nombre funcional"
                                      value={product.functionalName}
                                    />
                                    <PropertyListItem
                                      disableGutters
                                      label="Tipo de empaque"
                                      value={product.packagingTypeDesc}
                                    />
                                    <PropertyListItem
                                      disableGutters
                                      label="Descripcion del Producto"
                                      value={product.tradeItemDescription}
                                    />
                                     <PropertyListItem
                                      disableGutters
                                      label="Marca"
                                      value={product.brandName}
                                    />
                                    <PropertyListItem
                                      disableGutters
                                      label="Pais de origen"
                                      value={product.tradeItemCountryOfOrigin}
                                    />
                                    <PropertyListItem
                                      disableGutters
                                      label="Pais objetivo"
                                      value={product.targetMarketCountryCode}
                                    />
                                       <PropertyListItem

                                      disableGutters
                                      label="Codigo Cabys"

                                      value={(product.cabysCode ?? "No asignado") !== "" ? product.cabysCode : "No asignado"}
                                      />
                                    <PropertyListItem
                                      disableGutters
                                      label="Tipo de compra"
                                      value={product.tipoCompra_dsc}
                                    />
                                  


                                    <PropertyListItem
                                      disableGutters
                                      label="Subcategoria"
                                      value={product.subcategoria_dsc}
                                    />
                                    <PropertyListItem

                                    disableGutters
                                    label="Dun 14"

                                    value={(product.Dun14 ?? "No asignado") !== "" ? product.Dun14 : "No asignado"}
                                    />
                                      <PropertyListItem

                                      disableGutters
                                      label="Cantidad x Caja"

                                      value={(product.netContent_logist) ?  product.netContent_logist.toString() :''   }
                                      />
                                      <PropertyListItem

                                      disableGutters
                                      label="Alto Caja"

                                      value={(product.height_logist) ? product.height_logist.toString() : ''}
                                      />

                                      <PropertyListItem
                                      disableGutters
                                      label="Ancho Caja"
                                      value={(product.width_logist)? product.width_logist.toString(): ''}
                                      />
                                      <PropertyListItem
                                      disableGutters
                                      label="Fondo Caja"
                                      value={(product.depth_logist) ? product.depth_logist.toString(): ''}
                                      />
                                      <PropertyListItem
                                      disableGutters
                                      label="Peso Caja"
                                      value={(product.grossWeight_logist) ? product.grossWeight_logist.toString(): ''}
                                      />
                                      <PropertyListItem
                                      disableGutters
                                      label="Tipo Descripcion Caja"
                                      value={(product.packagingTypeDesc_logist) ? product.packagingTypeDesc_logist.toString(): ''}
                                      />
                                      <PropertyListItem
                                      disableGutters
                                      label="Unidad Medida Caja"
                                      value={(product.netContentUnitOfMeasure_logist) ? product.netContentUnitOfMeasure_logist.toString(): ''}
                                      />
                                      <PropertyListItem
                                      disableGutters
                                      label="Unidad Longitud Caja"
                                      value={(product.lengthUnitOfMeasure_logist) ? product.lengthUnitOfMeasure_logist.toString(): ''}
                                      />
                                      <PropertyListItem
                                      disableGutters
                                      label="Unidad Peso Caja"
                                      value={(product.weightUnitOfMeasure_logist) ? product.weightUnitOfMeasure_logist.toString(): ''}
                                      />

                                      <PropertyListItem
                                      disableGutters
                                      label="Cantidad articulos por Tarima"
                                      value={(product.quantityOfTradeItemsPerPallet) ? product.quantityOfTradeItemsPerPallet.toString(): ''}
                                      />

                                      <PropertyListItem
                                      disableGutters
                                      label="Factor de Apilado"
                                      value={(product.stackingFactor) ? product.stackingFactor.toString(): ''}
                                      />

                                      <PropertyListItem
                                      disableGutters
                                      label="Cantidad productos por capa de tarima"
                                      value={(product.quantityOfTradeItemsPerPalletLayer) ? product.quantityOfTradeItemsPerPalletLayer.toString(): ''}
                                      />

                                      <PropertyListItem
                                      disableGutters
                                      label="Cantidad de Capas por tarima"
                                      value={(product.quantityOfLayersPerPallet) ? product.quantityOfLayersPerPallet.toString(): ''}
                                      />
   
                                    {(user.UserType != "3" && user.UserType != "1") &&
                                      <>
                                        <PropertyListItem
                                          disableGutters
                                          label="Punto de venta"
                                          value={product.puntoVenta_dsc ?? "No asignado"}
                                        />
                                        <PropertyListItem
                                          disableGutters
                                          label="Descripcion larga"
                                          
                                          value={(product.ComercialLongDescription ?? "No asignado") !== "" ? product.ComercialLongDescription : "No asignado"}
                                        />

                                        <PropertyListItem
                                          disableGutters
                                          label="Descripcion Corta"
                                          
                                          value={(product.ComercialShortDescription ?? "No asignado") !== "" ? product.ComercialShortDescription : "No asignado"}
                                        />

                                        <PropertyListItem

                                          disableGutters
                                          label="Descripcion de publicacion"
                                        
                                          value={(product.ComercialPubliDescription ?? "No asignado") !== "" ? product.ComercialPubliDescription : "No asignado"}
                                        />
                                         <PropertyListItem

                                        disableGutters
                                        label="Descripcion Fonetica"

                                        value={(product.ComercialFonetDescription ?? "No asignado") !== "" ? product.ComercialFonetDescription : "No asignado"}
                                        />
                                        <PropertyListItem

                                        disableGutters
                                        label="Descripcion Hablador"

                                        value={(product.ComercialHablaDescription ?? "No asignado") !== "" ? product.ComercialHablaDescription : "No asignado"}
                                        />
                                      
                                      

 
                                      </>
                                    }

                                    {(user.UserType == '4') &&
                                      <>
                                        <PropertyListItem
                                          disableGutters
                                          label="Supercompro Utilidad Venta"
                                          value={(product.SupercomproCostSale)?.toString()}
                                        />
                                        <PropertyListItem
                                          disableGutters
                                          label="Supercompro Utilidad Costo"
                                          value={(product.SupercomproCostUtility)?.toString()}
                                        />
                                      </>
                                    }
                                  </Box>

                                </Grid>
                                <Grid
                                  item
                                  md={6}
                                  xs={12}>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      flexWrap: 'wrap',
                                      px: 2,
                                      py: 1
                                    }}>
                                    <PropertyListItem
                                      disableGutters
                                      label="Variante"
                                      value={product.variantDescription == '' ? 'No tiene variante' : product.variantDescription}
                                    />
                                    <PropertyListItem
                                      disableGutters
                                      label="Peso neto"
                                      value={`${product.netContent} ${product.netContentUnitOfMeasure}`}
                                    />
                                    <PropertyListItem
                                      disableGutters
                                      label="Peso bruto"
                                      value={`${product.grossWeight} ${product.weightUnitOfMeasure}`}
                                    />
                                    <PropertyListItem
                                      disableGutters
                                      label="Alto Ancho Profundo"
                                      value={`${product.height} X ${product.width} X ${product.depth} ${product.lengthUnitOfMeasure}`}
                                    />
                                    <PropertyListItem
                                      disableGutters
                                      label="Descripcion de publicación"
                                      value={product.descriptionShort}
                                    />
                                    <PropertyListItem
                                      disableGutters
                                      label="Contacto"
                                      value={product.contactName == '' ? 'No definido' : product.contactName}
                                    />
                                    
                                    <PropertyListItem
                                      disableGutters
                                      label="Identificacion de permiso de regulacion"
                                      value={product.regulatoryPermitIdentification}
                                    />
                                      <PropertyListItem

                                      disableGutters
                                      label="Descripcion Cabys"

                                      value={(product.cabysDesc ?? "No asignado") !== "" ? product.cabysDesc : "No asignado"}
                                      />
                                    
                                    <PropertyListItem
                                      disableGutters
                                      label="Categoria"
                                      value={product.categoria_dsc}
                                    />
                                   
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 3
                                      }}
                                    >
                                      <div>
                                        <Typography>
                                          Compra en unidad
                                        </Typography>
                                      </div>
                                      <Switch checked={product.CompraEnUnidad} />
                                    </Box>
                           


                                    
                                    {(user.UserType == '4') &&
                                      <>
                                        <PropertyListItem
                                          disableGutters
                                          label="Peri Utilidad Venta"
                                          value={(product.PeriCostSale)?.toString()}
                                        />
                                        <PropertyListItem
                                          disableGutters
                                          label="Peri Utilidad Costo"
                                          value={(product.PeriCostUtility)?.toString()}
                                        />
                                        <PropertyListItem
                                          disableGutters
                                          label="Saretto Utilidad Venta"
                                          value={(product.SarettoCostSale)?.toString()}
                                        />
                                        <PropertyListItem
                                          disableGutters
                                          label="Saretto Utilidad Costo"
                                          value={(product.SarettoCostUtility)?.toString()}
                                        />
                                        <PropertyListItem
                                          disableGutters
                                          label="Saretto Utilidad Costo"
                                          value={(product.sarettoPrice)?.toString()}
                                        />
                                        <PropertyListItem
                                          disableGutters
                                          label="Saretto Utilidad Costo"
                                          value={(product.superPrice)?.toString()}
                                        />
                                        <PropertyListItem
                                          disableGutters
                                          label="Saretto Utilidad Costo"
                                          value={(product.periPrice)?.toString()}
                                        />
                                      </>
                                    }
                                  </Box>

                                </Grid>

                              </Grid>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody >
        </Table >
      </Scrollbar >
      <TablePagination
        component="div"



        count={productsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div >
  );
};

ProductListTable.propTypes = {
  products: PropTypes.array.isRequired,
  productsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



