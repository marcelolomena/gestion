package utils

import java.io.FileInputStream
import org.apache.poi.hssf.usermodel.HSSFSheet
import org.apache.poi.hssf.usermodel.HSSFWorkbook
import org.apache.poi.poifs.filesystem.POIFSFileSystem
import org.apache.poi.ss.usermodel.Row
import services._

object ImportFromExcel {

  def readExcelFileSaveToDatabase(fileInputStream: FileInputStream) {
    val fs = new POIFSFileSystem(fileInputStream);
    val wb = new HSSFWorkbook(fs);
    val worksheet = wb.getSheet("Creación_Programa");

    for (i <- 1 to worksheet.getLastRowNum()) {
      val row = worksheet.getRow(i);

      val cellA = row.getCell(0)
      val aVal = cellA.getStringCellValue();

      /*   var valid_program_type_id: Long = 0
          if (!aVal.isEmpty()) {
            val program_type_id = ProgramTypeService.findIdByProgramType(aVal)
            valid_program_type_id = program_type_id
          }*/

      val cellB = row.getCell(1);
      val bVal = cellB.getStringCellValue();

      val cellC = row.getCell(2);
      val cVal = cellC.getStringCellValue();

      val cellD = row.getCell(3);
      val dVal = cellD.getStringCellValue();

      val cellE = row.getCell(4)
      val eVal = cellE.getStringCellValue();

      val cellF = row.getCell(5);
      val fVal = cellF.getStringCellValue();
      var valid_div_id: Long = 0
      if (!fVal.isEmpty) {
        //val div_id = DivisionService.findIdByDivision(fVal)
     //   valid_div_id = div_id.tostr
      }

      val cellG = row.getCell(6);
      val gVal = cellG.getStringCellValue();
      var valid_gerentia_id: Long = 0
      if (!gVal.isEmpty) {
        //val gern_id = GenrenciaService.findIdByGenrencia(gVal)
       // valid_gerentia_id = gern_id
      }

      val cellH = row.getCell(7);
      val hVal = cellH.getStringCellValue();
      var valid_department_id: Long = 0
      if (!hVal.isEmpty) {
       // val dept_id = services.DepartmentService.findIdByDepartment(hVal)
       // valid_department_id = dept_id
      }

      val cellI = row.getCell(8)
      val iVal = cellI.getDateCellValue()

      val cellJ = row.getCell(9);
      val jVal = cellJ.getDateCellValue()

      val cellK = row.getCell(10);
      val kVal = cellK.getDateCellValue()

      val cellL = row.getCell(11);
      val lVal = cellL.getDateCellValue()

      println("lVal  = " + lVal)

      /*  val program_details = ProgramDetail(valid_div_id.toInt, Option(valid_gerentia_id.toInt), Option(valid_department_id.toInt), null, null)

          val program_dates = ProgramDate(Option(iVal), jVal, Option(kVal), Option(lVal))
          val pro = Programs(NotAssigned, valid_program_type_id.toInt, null, bVal, 1111, Option(dVal), null, 1, 1, program_details, program_dates)*/
    }

    val worksheet1 = wb.getSheet("Creación_de_Proyecto");
    for (i <- 1 to worksheet1.getLastRowNum()) {
      val row = worksheet1.getRow(i);

      val cellA = row.getCell(0)
      val aVal = cellA.getStringCellValue();

      val cellB = row.getCell(1);
      val bVal = cellB.getStringCellValue();
      /*      var valid_program_type_id: Long = 0
      if (!bVal.isEmpty()) {
        val program_type_id = ProgramTypeService.findIdByProgramType(bVal)
        valid_program_type_id = program_type_id
      }*/

      val cellC = row.getCell(2);
      val cVal = cellC.getStringCellValue();

      val cellD = row.getCell(3);
      val dVal = cellD.getStringCellValue();

      val cellE = row.getCell(4)
      val eVal = cellE.getStringCellValue();

      val cellF = row.getCell(5)
      if (cellF != null) {
        val fVal = cellF.getDateCellValue()
      }

      val cellG = row.getCell(6);

      if (cellG != null) {
        //println("cellG = " + cellG)
        //val gVal = cellG.getDateCellValue()
      }

      val cellH = row.getCell(7);
      val hVal = cellH.getStringCellValue();

      val cellI = row.getCell(8);
      val iVal = cellI.getStringCellValue();

    }
    val worksheet2 = wb.getSheet("Creación_Tarea");
    for (i <- 1 to worksheet2.getLastRowNum()) {
      val row = worksheet2.getRow(i);

      val cellA = row.getCell(0)
      val aVal = cellA.getStringCellValue();

      val cellB = row.getCell(1);
      val bVal = cellB.getStringCellValue();

      val cellC = row.getCell(2);
      val cVal = cellC.getStringCellValue();

      val cellD = row.getCell(3);
      val dVal = cellD.getDateCellValue()

      val cellE = row.getCell(4)
      val eVal = cellE.getDateCellValue()

      val cellF = row.getCell(5)
      val fVal = cellF.getStringCellValue()

      val cellG = row.getCell(6);
      val gVal = cellG.getNumericCellValue()

      val cellH = row.getCell(7);
      val hVal = cellH.getStringCellValue()

      val cellI = row.getCell(8);
      val iVal = cellI.getStringCellValue();

      val cellJ = row.getCell(9);
      val jVal = cellJ.getStringCellValue();

      val cellK = row.getCell(10);
      //  val kVal = cellK.getNumericCellValue();

      val cellL = row.getCell(11);
      val lVal = cellL.getStringCellValue();

      val cellM = row.getCell(12);
      val mVal = cellM.getStringCellValue();

      val cellN = row.getCell(13);
      val nVal = cellN.getStringCellValue();

      val cellO = row.getCell(14);
      val oVal = cellO.getStringCellValue();
    }
    val worksheet3 = wb.getSheet("Creación_SubTareas");
    for (i <- 1 to worksheet3.getLastRowNum()) {
      val row = worksheet3.getRow(i);

      val cellA = row.getCell(0)
      val aVal = cellA.getStringCellValue();

      val cellB = row.getCell(1);
      val bVal = cellB.getStringCellValue();

      val cellC = row.getCell(2);
      val cVal = cellC.getStringCellValue();

      val cellD = row.getCell(3);
      val dVal = cellD.getStringCellValue();

      val cellE = row.getCell(4)
      val eVal = cellE.getDateCellValue()

      val cellF = row.getCell(5)
      val fVal = cellF.getDateCellValue()

      val cellG = row.getCell(6);
      val gVal = cellG.getNumericCellValue()

      val cellH = row.getCell(7);
      val hVal = cellH.getStringCellValue()

      // println("Creación_SubTareas hVal ="+hVal)
    }
    val worksheet4 = wb.getSheet("Asignacion_SubTareas");
    for (i <- 1 to worksheet4.getLastRowNum()) {
      val row = worksheet4.getRow(i);

      val cellA = row.getCell(0)
      val aVal = cellA.getStringCellValue();

      val cellB = row.getCell(1);
      val bVal = cellB.getStringCellValue();

      val cellC = row.getCell(2);
      val cVal = cellC.getStringCellValue();

      val cellD = row.getCell(3);
      val dVal = cellD.getStringCellValue();

      val cellE = row.getCell(4)
      val eVal = cellE.getStringCellValue();

      val cellI = row.getCell(5)
      val iVal = cellI.getNumericCellValue()

    }
  }
}