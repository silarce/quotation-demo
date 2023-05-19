



/**檢查字串格式是否為YYYY-MM-DD */
export const checkDateFormat = (str: string, format: "standard" | "tw" = "standard"): boolean => {
  const pattern =
    format === "standard" ? /^\d{4}-\d{2}-\d{2}$/ : /^\d{3}-\d{2}-\d{2}$/

  return pattern.test(str)
}