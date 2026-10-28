const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:032422@localhost:5432/llano_selecta_db'
});

async function main() {
  await client.connect();
  const tables = ['bookings', 'customers', 'discrepancies', 'employees', 'freezers', 'inventory_ledger', 'pos_sales', 'products', 'quotas', 'stock_receiving'];
  
  for (const t of tables) {
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = '${t}'
      ORDER BY ordinal_position;
    `);
    console.log(`\nTable ${t}:`);
    console.log(res.rows.map(r => `${r.column_name} (${r.data_type})`).join(', '));
  }

  await client.end();
}

main().catch(console.error);
