import { $Enums } from "@prisma/client";

class SubjectMap {
  private static instance: SubjectMap;
  private readonly map: Record<$Enums.subject_code, string>;
  private readonly reverseMap: Record<string, $Enums.subject_code>;
  private readonly keys: $Enums.subject_code[];

  private constructor() {
    this.map = {
      AMFA: "Accounting for Managers / Financial Accounting",
      ME: "Managerial Economics",
      OB: "Organizational Behavior",
      MKT: "Marketing Management",
      OM: "Operations Management",
      FMCM: "Financial Management / Corporate Finance",
      HRM: "Human Resource Management",
      SM: "Strategic Management",
      IT: "Information Technology",
      BC: "Business Communication",
      LBE: "Legal and Business Environment",
      RM: "Research Methodology",
      BECG: "Business Environment and Corporate Governance",
      ED: "Enterpreneurship Development",
    };
    this.reverseMap = Object.fromEntries(
      Object.entries(this.map).map(([key, value]) => [value, key])
    ) as Record<string, $Enums.subject_code>;

    this.keys = Object.keys(this.map) as $Enums.subject_code[];
  }

  static getInstance(): SubjectMap {
    if (!this.instance) {
      this.instance = new SubjectMap();
    }
    return this.instance;
  }

  get(subjectEnum: $Enums.subject_code) {
    return this.map[subjectEnum];
  }

  getSubjectEnum(subject: string) {
    return this.reverseMap[subject];
  }

  getSubjectName(subject: $Enums.subject_code) {
    return this.map[subject];
  }

  getSubjectKeys() {
    return this.keys;
  }

  isValidKey(key: string) {
    return this.keys.includes(key as $Enums.subject_code);
  }
}

const subjectMapper = SubjectMap.getInstance();

export default subjectMapper;
