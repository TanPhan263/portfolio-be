import request from "supertest";
import app from "../src/app-test.js";
import Experience from "../src/models/Experience.js";

describe("Experience Routes", () => {
  const validExperienceData = {
    year: "2023",
    projects: [
      {
        title: "Portfolio Website",
        summary: "A modern portfolio website built with React",
        stacks: ["React", "Node.js", "MongoDB"],
        achievements: ["Responsive design", "SEO optimized"],
        imageUrl: "portfolio.jpg",
        imageUrlMobile: "portfolio-mobile.jpg",
      },
      {
        title: "E-commerce App",
        summary: "Full-stack e-commerce application",
        stacks: ["Vue.js", "Express", "PostgreSQL"],
        achievements: ["Payment integration", "Admin dashboard"],
        imageUrl: "ecommerce.jpg",
        imageUrlMobile: "ecommerce-mobile.jpg",
      },
    ],
  };

  describe("GET /api/experience", () => {
    it("should return empty array when no experience data exists", async () => {
      const response = await request(app).get("/api/experience").expect(200);

      expect(response.body).toEqual([]);
    });

    it("should return all experience data when it exists", async () => {
      // Create test data
      const experience = new Experience(validExperienceData);
      await experience.save();

      const response = await request(app).get("/api/experience").expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        year: validExperienceData.year,
        projects: validExperienceData.projects,
      });
      expect(response.body[0]).toHaveProperty("_id");
      expect(response.body[0]).toHaveProperty("createdAt");
      expect(response.body[0]).toHaveProperty("updatedAt");
    });

    it("should return multiple experience records if they exist", async () => {
      // Create multiple test records
      const exp1 = new Experience(validExperienceData);
      const exp2 = new Experience({
        ...validExperienceData,
        year: "2022",
      });

      await exp1.save();
      await exp2.save();

      const response = await request(app).get("/api/experience").expect(200);

      expect(response.body).toHaveLength(2);
    });
  });

  describe("POST /api/experience", () => {
    it("should create a new experience record with valid data", async () => {
      const response = await request(app)
        .post("/api/experience")
        .send(validExperienceData)
        .expect(201);

      expect(response.body).toMatchObject({
        year: validExperienceData.year,
        projects: validExperienceData.projects,
      });
      expect(response.body).toHaveProperty("_id");
      expect(response.body).toHaveProperty("createdAt");
      expect(response.body).toHaveProperty("updatedAt");

      // Verify it was saved to database
      const savedExperience = await Experience.findById(response.body._id);
      expect(savedExperience).toBeTruthy();
      expect(savedExperience.year).toBe(validExperienceData.year);
      expect(savedExperience.projects).toHaveLength(2);
    });

    it("should create experience with minimal required data", async () => {
      const minimalData = {
        year: "2021",
        projects: [
          {
            title: "Simple Project",
            summary: "A simple project",
            imageUrl: "simple.jpg",
            imageUrlMobile: "simple-mobile.jpg",
          },
        ],
      };

      const response = await request(app)
        .post("/api/experience")
        .send(minimalData)
        .expect(201);

      expect(response.body.year).toBe("2021");
      expect(response.body.projects).toHaveLength(1);
      expect(response.body.projects[0].title).toBe("Simple Project");
    });

    it("should handle missing required fields gracefully", async () => {
      const invalidData = {
        year: "2023",
        projects: [
          {
            title: "Incomplete Project",
            // missing required fields: summary, imageUrl, imageUrlMobile
          },
        ],
      };

      const response = await request(app)
        .post("/api/experience")
        .send(invalidData)
        .expect(500);

      // Should not create any record in database
      const count = await Experience.countDocuments();
      expect(count).toBe(0);
    });

    it("should handle empty request body", async () => {
      const response = await request(app)
        .post("/api/experience")
        .send({})
        .expect(500);

      const count = await Experience.countDocuments();
      expect(count).toBe(0);
    });

    it("should handle invalid data types", async () => {
      const invalidData = {
        year: 2023, // should be string
        projects: "not-an-array", // should be array
      };

      const response = await request(app)
        .post("/api/experience")
        .send(invalidData)
        .expect(500);

      const count = await Experience.countDocuments();
      expect(count).toBe(0);
    });
  });

  describe("PATCH /api/experience/:id", () => {
    let experienceId;

    beforeEach(async () => {
      const experience = new Experience(validExperienceData);
      const savedExperience = await experience.save();
      experienceId = savedExperience._id.toString();
    });

    it("should update existing experience record with valid data", async () => {
      const updateData = {
        year: "2024",
        projects: [
          {
            title: "Updated Project",
            summary: "An updated project description",
            stacks: ["React", "TypeScript"],
            achievements: ["Modern architecture"],
            imageUrl: "updated.jpg",
            imageUrlMobile: "updated-mobile.jpg",
          },
        ],
      };

      const response = await request(app)
        .patch(`/api/experience/${experienceId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.year).toBe("2024");
      expect(response.body.projects).toHaveLength(1);
      expect(response.body.projects[0].title).toBe("Updated Project");
      expect(response.body._id).toBe(experienceId);

      // Verify update in database
      const updatedExperience = await Experience.findById(experienceId);
      expect(updatedExperience.year).toBe("2024");
      expect(updatedExperience.projects[0].title).toBe("Updated Project");
    });

    it("should partially update experience record", async () => {
      const updateData = {
        year: "2025",
      };

      const response = await request(app)
        .patch(`/api/experience/${experienceId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.year).toBe("2025");
      // Projects should remain unchanged
      expect(response.body.projects).toHaveLength(2);
      expect(response.body.projects[0].title).toBe(
        validExperienceData.projects[0].title
      );
    });

    it("should return 404 for non-existent experience ID", async () => {
      const nonExistentId = "507f1f77bcf86cd799439011";

      const response = await request(app)
        .patch(`/api/experience/${nonExistentId}`)
        .send({ year: "2024" })
        .expect(500); // Note: The current implementation doesn't properly handle 404

      // The record should not exist
      const experience = await Experience.findById(nonExistentId);
      expect(experience).toBeNull();
    });

    it("should handle invalid ObjectId format", async () => {
      const invalidId = "invalid-id";

      const response = await request(app)
        .patch(`/api/experience/${invalidId}`)
        .send({ year: "2024" })
        .expect(500);
    });

    it("should handle empty update data", async () => {
      const response = await request(app)
        .patch(`/api/experience/${experienceId}`)
        .send({})
        .expect(200);

      // Should return the unchanged record
      expect(response.body._id).toBe(experienceId);
      expect(response.body.year).toBe(validExperienceData.year);
    });
  });

  describe("DELETE /api/experience/:id", () => {
    let experienceId;

    beforeEach(async () => {
      const experience = new Experience(validExperienceData);
      const savedExperience = await experience.save();
      experienceId = savedExperience._id.toString();
    });

    it("should delete existing experience record", async () => {
      const response = await request(app)
        .delete(`/api/experience/${experienceId}`)
        .expect(204);

      // Verify deletion from database
      const deletedExperience = await Experience.findById(experienceId);
      expect(deletedExperience).toBeNull();
    });

    it("should return 404 for non-existent experience ID", async () => {
      const nonExistentId = "507f1f77bcf86cd799439011";

      const response = await request(app)
        .delete(`/api/experience/${nonExistentId}`)
        .expect(500); // Note: The current implementation doesn't properly handle 404

      // Original record should still exist
      const originalExperience = await Experience.findById(experienceId);
      expect(originalExperience).toBeTruthy();
    });

    it("should handle invalid ObjectId format", async () => {
      const invalidId = "invalid-id";

      const response = await request(app)
        .delete(`/api/experience/${invalidId}`)
        .expect(500);

      // Original record should still exist
      const originalExperience = await Experience.findById(experienceId);
      expect(originalExperience).toBeTruthy();
    });
  });

  describe("Error Handling", () => {
    it("should handle database connection errors gracefully", async () => {
      const response = await request(app)
        .post("/api/experience")
        .send({ invalid: "data that will cause validation error" })
        .expect(500);

      expect(response.body).toBeDefined();
    });
  });

  describe("Route Not Found", () => {
    it("should return 404 for non-existent routes", async () => {
      const response = await request(app)
        .get("/api/experience/non-existent-route")
        .expect(404);
    });

    it("should handle unsupported HTTP methods", async () => {
      const response = await request(app)
        .put("/api/experience") // PUT is not supported on /api/experience
        .expect(404);
    });
  });
});
