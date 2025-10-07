import request from "supertest";
import app from "../src/app-test.js";
import Home from "../src/models/Home.js";
import Experience from "../src/models/Experience.js";

describe("API Integration Tests", () => {
  describe("CORS and Middleware", () => {
    it("should include CORS headers in responses", async () => {
      const response = await request(app).get("/api/home").expect(200);

      expect(response.headers["access-control-allow-origin"]).toBeDefined();
    });

    it("should parse JSON request bodies", async () => {
      const testData = {
        year: "2023",
        projects: [
          {
            title: "Test Project",
            summary: "Test summary",
            imageUrl: "test.jpg",
            imageUrlMobile: "test-mobile.jpg",
          },
        ],
      };

      const response = await request(app)
        .post("/api/experience")
        .send(testData)
        .expect(201);

      expect(response.body.year).toBe("2023");
    });
  });

  describe("Error Handling Middleware", () => {
    it("should handle 404 errors for non-existent routes", async () => {
      const response = await request(app).get("/api/non-existent").expect(404);

      expect(response.body).toBeDefined();
    });

    it("should handle validation errors consistently", async () => {
      // Test with invalid home data
      const homeResponse = await request(app)
        .post("/api/home")
        .send({ invalid: "data" })
        .expect(500);

      // Test with invalid experience data
      const expResponse = await request(app)
        .post("/api/experience")
        .send({ invalid: "data" })
        .expect(500);

      // Both should return error responses
      expect(homeResponse.body).toBeDefined();
      expect(expResponse.body).toBeDefined();
    });
  });

  describe("Data Consistency", () => {
    it("should maintain data integrity across multiple operations", async () => {
      // Create home data
      const homeData = {
        menu: [{ text: "Home", url: "/" }],
        greeting: {
          greetingText: "Hello",
          name: "Test User",
          bioTitle: "Developer",
          bioDescription: "Test bio",
          imageDark: "dark.jpg",
          image: "light.jpg",
          roles: ["Developer"],
        },
        socials: [],
      };

      const homeResponse = await request(app)
        .post("/api/home")
        .send(homeData)
        .expect(201);

      // Create experience data
      const expData = {
        year: "2023",
        projects: [
          {
            title: "Test Project",
            summary: "Test summary",
            imageUrl: "test.jpg",
            imageUrlMobile: "test-mobile.jpg",
          },
        ],
      };

      const expResponse = await request(app)
        .post("/api/experience")
        .send(expData)
        .expect(201);

      // Verify both records exist
      const homeCheck = await request(app).get("/api/home").expect(200);

      const expCheck = await request(app).get("/api/experience").expect(200);

      expect(homeCheck.body).toHaveLength(1);
      expect(expCheck.body).toHaveLength(1);

      // Update home record
      const updateResponse = await request(app)
        .patch(`/api/home/${homeResponse.body._id}`)
        .send({ greeting: { ...homeData.greeting, name: "Updated User" } })
        .expect(200);

      expect(updateResponse.body.greeting.name).toBe("Updated User");

      // Delete experience record
      await request(app)
        .delete(`/api/experience/${expResponse.body._id}`)
        .expect(204);

      // Verify final state
      const finalHomeCheck = await request(app).get("/api/home").expect(200);

      const finalExpCheck = await request(app)
        .get("/api/experience")
        .expect(200);

      expect(finalHomeCheck.body).toHaveLength(1);
      expect(finalHomeCheck.body[0].greeting.name).toBe("Updated User");
      expect(finalExpCheck.body).toHaveLength(0);
    });
  });

  describe("Performance and Limits", () => {
    it("should handle multiple concurrent requests", async () => {
      const requests = [];

      // Create multiple concurrent GET requests
      for (let i = 0; i < 10; i++) {
        requests.push(request(app).get("/api/home"));
        requests.push(request(app).get("/api/experience"));
      }

      const responses = await Promise.all(requests);

      // All requests should succeed
      responses.forEach((response) => {
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      });
    });

    it("should handle large data payloads", async () => {
      const largeHomeData = {
        menu: Array.from({ length: 50 }, (_, i) => ({
          text: `Menu Item ${i}`,
          url: `/item-${i}`,
        })),
        greeting: {
          greetingText: "Hello",
          name: "Test User",
          bioTitle: "Developer",
          bioDescription: "A".repeat(1000), // Large description
          imageDark: "dark.jpg",
          image: "light.jpg",
          roles: Array.from({ length: 20 }, (_, i) => `Role ${i}`),
        },
        socials: Array.from({ length: 30 }, (_, i) => ({
          name: `Social ${i}`,
          createdAt: "2023-01-01",
          text: `Social post ${i}`,
          tags: [`tag${i}`, `tag${i + 1}`],
          images: [`image${i}.jpg`],
          likes: i * 10,
          comments: i * 5,
        })),
      };

      const response = await request(app)
        .post("/api/home")
        .send(largeHomeData)
        .expect(201);

      expect(response.body.menu).toHaveLength(50);
      expect(response.body.socials).toHaveLength(30);
      expect(response.body.greeting.roles).toHaveLength(20);
    });
  });

  describe("Content-Type Handling", () => {
    it("should require JSON content-type for POST requests", async () => {
      const response = await request(app)
        .post("/api/home")
        .set("Content-Type", "text/plain")
        .send("invalid data")
        .expect(500); // Express will try to parse as JSON and fail
    });

    it("should handle missing content-type gracefully", async () => {
      const response = await request(app)
        .post("/api/experience")
        .send("{}")
        .expect(500); // Will fail due to invalid JSON parsing
    });
  });

  describe("Database State Management", () => {
    it("should properly isolate test data", async () => {
      // This test ensures our test setup is working correctly
      const initialHomeCount = await Home.countDocuments();
      const initialExpCount = await Experience.countDocuments();

      expect(initialHomeCount).toBe(0);
      expect(initialExpCount).toBe(0);

      // Create some data
      await request(app)
        .post("/api/home")
        .send({
          menu: [],
          greeting: {
            greetingText: "Test",
            name: "Test",
            bioTitle: "Test",
            bioDescription: "Test",
            imageDark: "test.jpg",
            image: "test.jpg",
            roles: ["Test"],
          },
          socials: [],
        })
        .expect(201);

      const midHomeCount = await Home.countDocuments();
      expect(midHomeCount).toBe(1);
    });
  });
});
