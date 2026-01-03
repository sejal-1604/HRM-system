const db = require('../config/db');

class SalaryInfo {
  
  static async get(userId) {
    const [rows] = await db.query('SELECT * FROM salary_info WHERE user_id = ?', [userId]);
    return rows[0];
  }
  
  static calculateComponents(monthlyWage) {
    const basic = monthlyWage * 0.50;
    const hra = basic * 0.50;
    const standardAllowance = monthlyWage * 0.1667;
    const performanceBonus = monthlyWage * 0.0833;
    const lta = monthlyWage * 0.0833;
    const fixedAllowance = monthlyWage - (basic + hra + standardAllowance + performanceBonus + lta);
    const employeePf = basic * 0.12;
    const employerPf = basic * 0.12;
    const professionalTax = 200;
    
    return {
      monthly_wage: monthlyWage,
      yearly_wage: monthlyWage * 12,
      basic_salary: basic,
      basic_percentage: 50.00,
      hra: hra,
      hra_percentage: 50.00,
      standard_allowance: standardAllowance,
      standard_allowance_percentage: 16.67,
      performance_bonus: performanceBonus,
      performance_bonus_percentage: 8.33,
      lta: lta,
      lta_percentage: 8.33,
      fixed_allowance: fixedAllowance,
      fixed_allowance_percentage: (fixedAllowance / monthlyWage * 100).toFixed(2),
      employee_pf: employeePf,
      employee_pf_percentage: 12.00,
      employer_pf: employerPf,
      employer_pf_percentage: 12.00,
      professional_tax: professionalTax
    };
  }
  
  static async createOrUpdate(userId, monthlyWage, workingDays, breakTime) {
    const components = this.calculateComponents(monthlyWage);
    
    const [existing] = await db.query('SELECT id FROM salary_info WHERE user_id = ?', [userId]);
    
    if (existing.length === 0) {
      await db.query(
        `INSERT INTO salary_info (user_id, monthly_wage, yearly_wage, working_days_per_week, break_time_hours,
         basic_salary, basic_percentage, hra, hra_percentage, standard_allowance, standard_allowance_percentage,
         performance_bonus, performance_bonus_percentage, lta, lta_percentage, fixed_allowance, fixed_allowance_percentage,
         employee_pf, employee_pf_percentage, employer_pf, employer_pf_percentage, professional_tax)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, components.monthly_wage, components.yearly_wage, workingDays, breakTime,
         components.basic_salary, components.basic_percentage, components.hra, components.hra_percentage,
         components.standard_allowance, components.standard_allowance_percentage, components.performance_bonus,
         components.performance_bonus_percentage, components.lta, components.lta_percentage,
         components.fixed_allowance, components.fixed_allowance_percentage, components.employee_pf,
         components.employee_pf_percentage, components.employer_pf, components.employer_pf_percentage,
         components.professional_tax]
      );
    } else {
      await db.query(
        `UPDATE salary_info SET monthly_wage = ?, yearly_wage = ?, working_days_per_week = ?, break_time_hours = ?,
         basic_salary = ?, basic_percentage = ?, hra = ?, hra_percentage = ?, standard_allowance = ?,
         standard_allowance_percentage = ?, performance_bonus = ?, performance_bonus_percentage = ?,
         lta = ?, lta_percentage = ?, fixed_allowance = ?, fixed_allowance_percentage = ?,
         employee_pf = ?, employee_pf_percentage = ?, employer_pf = ?, employer_pf_percentage = ?,
         professional_tax = ? WHERE user_id = ?`,
        [components.monthly_wage, components.yearly_wage, workingDays, breakTime,
         components.basic_salary, components.basic_percentage, components.hra, components.hra_percentage,
         components.standard_allowance, components.standard_allowance_percentage, components.performance_bonus,
         components.performance_bonus_percentage, components.lta, components.lta_percentage,
         components.fixed_allowance, components.fixed_allowance_percentage, components.employee_pf,
         components.employee_pf_percentage, components.employer_pf, components.employer_pf_percentage,
         components.professional_tax, userId]
      );
    }
  }
}

module.exports = SalaryInfo;