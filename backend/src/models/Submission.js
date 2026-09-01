const db = require("../config/db");

function mapRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    teamName: row.team_name,
    videoTitle: row.video_title,
    videoUrl: row.video_url,
    fileUrl: row.file_url,
    fileKey: row.file_key,
    description: row.description,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

class Submission {
  static async create({
    fullName,
    email,
    phone = null,
    teamName = null,
    videoTitle,
    videoUrl = null,
    fileUrl = null,
    fileKey = null,
    description = null,
    status = "pending",
  }) {
    const text = `
      INSERT INTO submissions (
        full_name, email, phone, team_name,
        video_title, video_url, file_url, file_key,
        description, status, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      RETURNING *;
    `;
    const values = [
      fullName,
      email,
      phone,
      teamName,
      videoTitle,
      videoUrl,
      fileUrl,
      fileKey,
      description,
      status,
    ];

    const { rows } = await db.query(text, values);
    return mapRow(rows[0]);
  }

  static async find() {
    const { rows } = await db.query(
      "SELECT * FROM submissions ORDER BY created_at DESC;"
    );
    return rows.map(mapRow);
  }

  static async findById(id) {
    const { rows } = await db.query(
      "SELECT * FROM submissions WHERE id = $1;",
      [id]
    );
    return mapRow(rows[0]);
  }

  static async updateStatus(id, status) {
    const text = `
      UPDATE submissions
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `;
    const { rows } = await db.query(text, [status, id]);
    return mapRow(rows[0]);
  }

  static async deleteById(id) {
    const { rows } = await db.query(
      "DELETE FROM submissions WHERE id = $1 RETURNING *;",
      [id]
    );
    return mapRow(rows[0]);
  }
}

module.exports = Submission;
