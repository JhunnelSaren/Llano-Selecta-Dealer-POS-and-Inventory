const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:032422@localhost:5432/llano_selecta_db'
});

async function main() {
  await client.connect();
  console.log('Connected to llano_selecta_db!');
  
  const res = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);
  
  console.log('Existing tables:');
  for (const row of res.rows) {
    const countRes = await client.query(`SELECT COUNT(*) FROM "${row.table_name}";`);
    console.log(`- ${row.table_name}: ${countRes.rows[0].count} records`);
  }
  
  await client.end();
}

main().catch(err => {
  console.error('Database inspection error:', err);
  process.exit(1);
});
