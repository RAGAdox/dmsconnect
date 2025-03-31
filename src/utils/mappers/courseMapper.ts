import { $Enums } from "@prisma/client";

class CourseMap {
  private static instance: CourseMap;
  private readonly map: Record<$Enums.course, string>;
  private readonly reverseMap: Record<string, $Enums.course>;
  private readonly keys: $Enums.course[];

  private constructor() {
    this.map = {
      mba: "Masters of Buisness Administration",
      bba: "Bachelor of Buisness Administration",
    };
    this.reverseMap = Object.fromEntries(
      Object.entries(this.map).map(([key, value]) => [value.toString(), key])
    ) as Record<string, $Enums.course>;

    this.keys = Object.keys(this.map) as $Enums.course[];
  }

  static getInstance(): CourseMap {
    if (!this.instance) {
      this.instance = new CourseMap();
    }
    return this.instance;
  }

  get(courseEnum: $Enums.course) {
    return this.map[courseEnum];
  }

  getCourseEnum(course: string) {
    console.log("getCourseEnum");
    return this.reverseMap[course];
  }

  getCourseName(course: $Enums.course) {
    return this.map[course];
  }

  getCourseKeys() {
    return this.keys;
  }

  isValidKey(key: string) {
    return this.keys.includes(key as $Enums.course);
  }
}

const courseMapper = CourseMap.getInstance();
export default courseMapper;
